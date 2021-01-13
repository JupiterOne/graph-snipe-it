import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  MappedRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import {
  convertHardware,
  DEVICE_LOCATION_RELATIONSHIP,
  DEVICE_MANAGEMENT_RELATIONSHIP,
  getAccountEntity,
  mapHardwareLocationRelationship,
  mapHardwareRelationship,
} from '../../converter';
import { IntegrationConfig } from '../../types';

export async function fetchHardwareAssets({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance);
  const accountEntity = getAccountEntity(instance);

  const hardware = await client.listHardware();

  const hardwareEntities = hardware.map(convertHardware);
  const relationships: MappedRelationship[] = [];
  hardwareEntities.forEach((hardwareEntity) => {
    if (hardwareEntity.macAddress) {
      relationships.push(
        mapHardwareRelationship(accountEntity, hardwareEntity, 'macAddress'),
      );
    } else if (hardwareEntity.serial) {
      relationships.push(
        mapHardwareRelationship(accountEntity, hardwareEntity, 'serial'),
      );
    } else {
      relationships.push(
        mapHardwareRelationship(accountEntity, hardwareEntity, 'hardwareId'),
      );
    }

    if (hardwareEntity.locationId) {
      relationships.push(mapHardwareLocationRelationship(hardwareEntity));
    }
  });
  await jobState.addRelationships(relationships);
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
