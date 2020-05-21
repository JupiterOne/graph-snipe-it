import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationRelationship,
} from '@jupiterone/integration-sdk';

import { createServicesClient } from '../../collector';
import { convertHardware, getAccountEntity } from '../../converter';

const step: IntegrationStep = {
  id: 'fetch-hardware',
  name: 'Fetch Snipe-IT listing of hardware assets',
  types: ['hardware'],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const client = createServicesClient(instance);
    const accountEntity = getAccountEntity(instance);

    const hardware = await client.listHardware();

    const hardwareEntities = hardware.map(convertHardware);
    await jobState.addEntities(hardwareEntities);

    const relationships = [];
    hardwareEntities.forEach((hardwareEntity) => {
      relationships.push(
        createIntegrationRelationship({
          from: accountEntity,
          to: hardwareEntity,
          _class: 'MANAGES',
        }),
      );
      if (hardwareEntity.locationId) {
        relationships.push(
          createIntegrationRelationship({
            fromType: 'location',
            fromKey: `location:${hardwareEntity.locationId}`,
            toType: hardwareEntity._type,
            toKey: hardwareEntity._key,
            _class: 'HAS',
          }),
        );
      }
    });
    await jobState.addRelationships(relationships);
  },
};

export default step;
