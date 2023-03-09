import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import {
  convertLicense,
  createLicenseHardwareMappedRelationship,
} from './converter';
import { IntegrationConfig } from '../../types';
import { ACCOUNT_ENTITY_KEY } from '../fetch-account';
import {
  Entities,
  HARDWARE_IDS,
  MappedRelationships,
  Relationships,
  Steps,
} from '../constants';
import { FatalRequestError } from '../../collector/error';

export async function fetchLicensedApplications({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  const hardwareIds = (await jobState.getData(HARDWARE_IDS)) as number[];

  for (const hardwareId of hardwareIds) {
    try {
      await client.iterateHardwareLicenses(hardwareId, async (license) => {
        const licenseEntity = await jobState.addEntity(convertLicense(license));
        await jobState.addRelationship(
          createDirectRelationship({
            from: accountEntity,
            to: licenseEntity,
            _class: RelationshipClass.HAS,
          }),
        );
        await jobState.addRelationship(
          createLicenseHardwareMappedRelationship(licenseEntity, hardwareId),
        );
      });
    } catch (err) {
      if (err instanceof FatalRequestError && err.statusCode === 403) {
        logger.info(
          `Skipped step "${Steps.LICENSES}". The required permission was not provided to perform this step.`,
        );
        return;
      }
      throw err;
    }
  }
}

export const licensesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.LICENSES,
    name: 'Fetch Snipe-IT listing of licensed applications',
    entities: [
      {
        _class: Entities.LICENSE._class,
        _type: Entities.LICENSE._type,
        resourceName: Entities.LICENSE.resourceName,
      },
    ],
    relationships: [
      {
        _class: Relationships.ACCOUNT_HAS_LICENSE._class,
        _type: Relationships.ACCOUNT_HAS_LICENSE._type,
        sourceType: Relationships.ACCOUNT_HAS_LICENSE.sourceType,
        targetType: Relationships.ACCOUNT_HAS_LICENSE.targetType,
      },
    ],
    mappedRelationships: [
      {
        _class: MappedRelationships.LICENSE_INSTALLED_HARDWARE._class,
        _type: MappedRelationships.LICENSE_INSTALLED_HARDWARE._type,
        sourceType: MappedRelationships.LICENSE_INSTALLED_HARDWARE.sourceType,
        targetType: MappedRelationships.LICENSE_INSTALLED_HARDWARE.targetType,
        direction: MappedRelationships.LICENSE_INSTALLED_HARDWARE.direction,
      },
    ],
    dependsOn: [Steps.ACCOUNT, Steps.HARDWARE],
    executionHandler: fetchLicensedApplications,
  },
];
