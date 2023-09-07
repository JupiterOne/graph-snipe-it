import {
  createDirectRelationship,
  Entity,
  IntegrationProviderAPIError,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import { convertLicense } from './converter';
import { ACCOUNT_ENTITY_KEY } from '../fetch-account';
import { Entities, Relationships, Steps } from '../constants';
import { IntegrationConfig } from '../../instanceConfigFields';

export async function fetchLicensedApplications({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance, logger);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await jobState.iterateEntities(
    { _type: Entities.HARDWARE._type },
    async (hardwareEntity) => {
      const hardwareId = Number(hardwareEntity.id);

      try {
        await client.iterateHardwareLicenses(hardwareId, async (license) => {
          const licenseEntity = await jobState.addEntity(
            convertLicense(license),
          );
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: accountEntity,
              to: licenseEntity,
            }),
          );
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.INSTALLED,
              from: hardwareEntity,
              to: licenseEntity,
            }),
          );
        });
      } catch (err) {
        if (err instanceof IntegrationProviderAPIError && err.status === 403) {
          logger.info(
            `Skipped step "${Steps.LICENSES}". The required permission was not provided to perform this step.`,
          );
          return;
        }
        throw err;
      }
    },
  );
}

export const licensesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.LICENSES,
    name: 'Fetch Snipe-IT listing of licensed applications',
    entities: [Entities.LICENSE],
    relationships: [
      Relationships.ACCOUNT_HAS_LICENSE,
      Relationships.HARDWARE_INSTALLED_LICENSE,
    ],
    mappedRelationships: [],
    dependsOn: [Steps.ACCOUNT, Steps.HARDWARE],
    executionHandler: fetchLicensedApplications,
  },
];
