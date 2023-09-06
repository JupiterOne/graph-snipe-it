import {
  Entity,
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import { convertHardware, mapHardwareLocationRelationship } from './converter';
import { IntegrationConfig } from '../../types';
import {
  Entities,
  MappedRelationships,
  Relationships,
  Steps,
} from '../constants';
import { ACCOUNT_ENTITY_KEY } from '../fetch-account';
import { getUserKey } from '../fetch-users/converter';

export async function fetchHardwareAssets({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await client.iterateHardware(async (hardware) => {
    const hardwareEntity = convertHardware(hardware);
    await jobState.addEntity(hardwareEntity);

    const accountHardwareRelationship = createDirectRelationship({
      _class: RelationshipClass.MANAGES,
      from: accountEntity,
      to: hardwareEntity,
    });
    await jobState.addRelationship(accountHardwareRelationship);
    if (hardwareEntity.locationId) {
      await jobState.addRelationship(
        mapHardwareLocationRelationship(hardwareEntity),
      );
    }
    if (hardware.assigned_to) {
      const userId =
        hardware.assigned_to.type === 'user' ? hardware.assigned_to.id : null;
      if (!userId) {
        return;
      }
      const userKey = getUserKey(String(userId));
      if (jobState.hasKey(userKey)) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            fromKey: userKey,
            fromType: Entities.USER._type,
            toKey: hardwareEntity._key,
            toType: Entities.HARDWARE._type,
          }),
        );
      }
    }
  });
}

export const hardwareSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.HARDWARE,
    name: 'Fetch Snipe-IT listing of hardware assets',
    entities: [Entities.HARDWARE],
    relationships: [
      Relationships.ACCOUNT_MANAGES_HARDWARE,
      Relationships.USER_HAS_HARDWARE,
    ],
    mappedRelationships: [MappedRelationships.LOCATION_HAS_HARDWARE],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchHardwareAssets,
  },
];
