import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationRelationship,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import {
  convertLocation,
  getAccountEntity,
  getServiceEntity,
} from '../../converter';
import { IntegrationConfig } from '../../types';

const step: IntegrationStep = {
  id: 'fetch-account',
  name: 'Fetch Account related data',
  types: [
    'snipeit_account',
    'snipeit_service',
    'location',
    'snipeit_account_provides_service',
    'snipeit_account_manages_location',
  ],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext<IntegrationConfig>) {
    const client = createServicesClient(instance);

    const accountEntity = getAccountEntity(instance);
    await jobState.addEntity(accountEntity);

    const serviceEntity = getServiceEntity(instance);
    await jobState.addEntity(serviceEntity);

    const accountServiceRelationship = createIntegrationRelationship({
      from: accountEntity,
      to: serviceEntity,
      _class: 'PROVIDES',
    });
    await jobState.addRelationship(accountServiceRelationship);

    const locations = await client.listLocations();
    const locationEntities = locations.map(convertLocation);
    await jobState.addEntities(locationEntities);

    const relationships = locationEntities.map((locationEntity) =>
      createIntegrationRelationship({
        from: accountEntity,
        to: locationEntity,
        _class: 'MANAGES',
      }),
    );
    await jobState.addRelationships(relationships);
  },
};

export default step;
