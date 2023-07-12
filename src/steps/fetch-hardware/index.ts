import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  MappedRelationship,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import {
  convertHardware,
  mapHardwareLocationRelationship,
  mapHardwareRelationship,
} from './converter';
import { IntegrationConfig } from '../../types';
import { HARDWARE_IDS, MappedRelationships, Steps } from '../constants';
import { ACCOUNT_ENTITY_KEY } from '../fetch-account';
import { getLocationKey } from '../fetch-account/converter';

export async function fetchHardwareAssets({
  logger,
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance, logger);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;
  const hardwareIds: number[] = [];

  await client.iterateHardware(async (device) => {
    let assignedUser = device.assigned_to;

    // Only query the user if we don't have assigned information in the
    // device payload.
    if (!assignedUser?.username || !assignedUser?.id || !assignedUser?.email) {
      const username = assignedUser?.username || assignedUser;
      assignedUser = username ? await client.fetchUser(username) : undefined;
    }

    hardwareIds.push(device.id);

    // Do not add to graph directly, this is used as the target of a number of
    // mapped relationships
    const targetEntity = convertHardware(device, assignedUser);

    const relationships: MappedRelationship[] = [];

    // First check if the relationship already exists.  Otherwise we run the risk of throwing a
    // duplicate key error if it's already been added.
    if (
      accountEntity &&
      !jobState.hasKey(`${accountEntity._key}|manages|${targetEntity._key}`)
    ) {
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
    }

    if (
      targetEntity.locationId &&
      !jobState.hasKey(
        `${getLocationKey(targetEntity.locationId as number)}|has|${
          targetEntity._key
        }`,
      )
    ) {
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

  await jobState.setData(HARDWARE_IDS, hardwareIds);
}

export const hardwareSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.HARDWARE,
    name: 'Fetch Snipe-IT listing of hardware assets',
    entities: [],
    relationships: [],
    mappedRelationships: [
      {
        _class: MappedRelationships.ACCOUNT_MANAGES_HARDWARE._class,
        _type: MappedRelationships.ACCOUNT_MANAGES_HARDWARE._type,
        sourceType: MappedRelationships.ACCOUNT_MANAGES_HARDWARE.sourceType,
        targetType: MappedRelationships.ACCOUNT_MANAGES_HARDWARE.targetType,
        direction: MappedRelationships.ACCOUNT_MANAGES_HARDWARE.direction,
      },
      {
        _class: MappedRelationships.LOCATION_HAS_HARDWARE._class,
        _type: MappedRelationships.LOCATION_HAS_HARDWARE._type,
        sourceType: MappedRelationships.LOCATION_HAS_HARDWARE.sourceType,
        targetType: MappedRelationships.LOCATION_HAS_HARDWARE.targetType,
        direction: MappedRelationships.LOCATION_HAS_HARDWARE.direction,
      },
    ],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchHardwareAssets,
  },
];
