import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk';
import { IntegrationConfig } from 'src/types';
import { createServicesClient } from '../../collector';
import {
  convertHardware,
  getAccountEntity,
  DEVICE_MANAGEMENT_RELATIONSHIP,
  DEVICE_LOCATION_RELATIONSHIP,
  mapHardwareRelationship,
  mapHardwareLocationRelationship,
} from '../../converter';

const step: IntegrationStep = {
  id: 'fetch-hardware',
  name: 'Fetch Snipe-IT listing of hardware assets',
  types: [
    'hardware', // Deprecated. Step creates mapped entities intead.
    DEVICE_MANAGEMENT_RELATIONSHIP,
    DEVICE_LOCATION_RELATIONSHIP,
  ],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext<IntegrationConfig>) {
    const client = createServicesClient(instance);
    const accountEntity = getAccountEntity(instance);

    const hardware = await client.listHardware();

    const hardwareEntities = hardware.map(convertHardware);
    const relationships = [];
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
  },
};

export default step;
