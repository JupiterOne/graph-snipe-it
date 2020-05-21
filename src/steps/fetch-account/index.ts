import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk';

import { createServicesClient } from '../../collector';
import { convertLocation } from '../../converter';

const step: IntegrationStep = {
  id: 'fetch-account',
  name: 'Fetch Account related data',
  types: ['snipeit_account'],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const client = createServicesClient(instance);

    const accountEntity = {
      _key: `snipe-it:account:${instance.id}`,
      _type: 'snipeit_account',
      _class: ['Account'],
      name: instance.name,
      displayName: instance.name,
      description: instance.description,
    };
    await jobState.addEntity(accountEntity);

    const locations = await client.listLocations();
    const entities = locations.map(convertLocation);
    await jobState.addEntities(entities);
  },
};

export default step;
