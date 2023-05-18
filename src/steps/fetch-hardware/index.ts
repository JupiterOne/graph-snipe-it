import {
  Entity,
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  MappedRelationship,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import { convertHardware, mapHardwareLocationRelationship } from './converter';
import { IntegrationConfig } from '../../types';
import {
  Entities,
  HARDWARE_IDS,
  MappedRelationships,
  Steps,
} from '../constants';
import { ACCOUNT_ENTITY_KEY } from '../fetch-account';

export async function fetchHardwareAssets({
  logger,
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  const hardware = await client.listHardware();
  const hardwareEntities = hardware.map(convertHardware);
  const relationships: MappedRelationship[] = [];
  await jobState.addEntities(hardwareEntities);

  hardwareEntities.map(async (hardwareEntity) => {
    await jobState.addRelationships([
      createDirectRelationship({
        from: accountEntity,
        to: hardwareEntity,
        _class: RelationshipClass.MANAGES,
      }),
    ]);
    if (hardwareEntity.locationId) {
      relationships.push(mapHardwareLocationRelationship(hardwareEntity));
    }
    if (hardwareEntity.userId) {
      const id = hardwareEntity.userId;
      const userEntity: Entity = (await jobState.findEntity(
        `snipeit_user:${id}`,
      )) as Entity;
      if (userEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: userEntity,
            to: hardwareEntity,
          }),
        );
      }
    }
  });
  if (relationships.length !== 0) {
    await jobState.addRelationships(relationships);
  }
  const hardwareIds = hardware.map((hw) => hw.id);
  await jobState.setData(HARDWARE_IDS, hardwareIds);
}

export const hardwareSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.HARDWARE,
    name: 'Fetch Snipe-IT listing of hardware assets',
    entities: [
      {
        _class: Entities.HARDWARE._class,
        _type: Entities.HARDWARE._type,
        resourceName: Entities.HARDWARE.resourceName,
      },
    ],
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
      {
        _class: MappedRelationships.USER_HAS_HARDWARE._class,
        _type: MappedRelationships.USER_HAS_HARDWARE._type,
        sourceType: MappedRelationships.USER_HAS_HARDWARE.sourceType,
        targetType: MappedRelationships.USER_HAS_HARDWARE.targetType,
        direction: MappedRelationships.USER_HAS_HARDWARE.direction,
      },
    ],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchHardwareAssets,
  },
];
