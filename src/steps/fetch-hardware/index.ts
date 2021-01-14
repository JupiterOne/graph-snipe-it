import {
    IntegrationStep, IntegrationStepExecutionContext, MappedRelationship, RelationshipClass
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import {
    convertHardware, DEVICE_LOCATION_RELATIONSHIP, DEVICE_MANAGEMENT_RELATIONSHIP, getAccountEntity,
    mapHardwareLocationRelationship, mapHardwareRelationship
} from '../../converter';
import { IntegrationConfig } from '../../types';

export async function fetchHardwareAssets({
  logger,
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance);
  const accountEntity = getAccountEntity(instance);

    await client.iterateHardware(async (device) => {
      const assignedUser = device.assigned_to;
      const username = assignedUser?.username || assignedUser
      const user = username
        ? await client.fetchUser(username)
        : undefined;

    // Do not add to graph directly, this is used as the target of a number of
    // mapped relationships
    const targetEntity = convertHardware(device, user);

    const relationships: MappedRelationship[] = [];
    if (targetEntity.macAddress) {
      relationships.push(
        mapHardwareRelationship(accountEntity, targetEntity, 'macAddress'),
      );
    } else if (targetEntity.serial) {
      relationships.push(
        mapHardwareRelationship(accountEntity, targetEntity, 'serial'),
      );
    } else if (targetEntity.hardwareId) {
      relationships.push(
        mapHardwareRelationship(accountEntity, targetEntity, 'hardwareId'),
      );
    }

    if (targetEntity.locationId) {
      relationships.push(mapHardwareLocationRelationship(targetEntity));
    }

    if (relationships.length !== 0) {
      await jobState.addRelationships(relationships);
    } else {
      logger.warn(
        { assetId: device.assetId, username: assignedUser?.username },
        'Hardware asset has no supported identifier, mapped relationship not created',
      );
    }
  });
}

export const hardwareSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'fetch-hardware',
    name: 'Fetch Snipe-IT listing of hardware assets',
    entities: [],
    relationships: [
      {
        _class: RelationshipClass.MANAGES,
        _type: DEVICE_MANAGEMENT_RELATIONSHIP,
        sourceType: 'snipeit_account',
        targetType: 'hardware',
      },
      {
        _class: RelationshipClass.HAS,
        _type: DEVICE_LOCATION_RELATIONSHIP,
        sourceType: 'site',
        targetType: 'hardware',
      },
    ],
    executionHandler: fetchHardwareAssets,
  },
];
