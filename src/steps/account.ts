import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../collector';
import {
  convertLocation,
  getAccountEntity,
  getServiceEntity,
} from '../converter';
import { IntegrationConfig } from '../types';

export async function fetchAccount({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance);

  const accountEntity = getAccountEntity(instance);
  await jobState.addEntity(accountEntity);

  const serviceEntity = getServiceEntity(instance);
  await jobState.addEntity(serviceEntity);

  const accountServiceRelationship = createDirectRelationship({
    from: accountEntity,
    to: serviceEntity,
    _class: RelationshipClass.PROVIDES,
  });
  await jobState.addRelationship(accountServiceRelationship);

  const locations = await client.listLocations();
  const locationEntities = locations.map(convertLocation);
  await jobState.addEntities(locationEntities);

  const relationships = locationEntities.map((locationEntity) =>
    createDirectRelationship({
      from: accountEntity,
      to: locationEntity,
      _class: RelationshipClass.MANAGES,
    }),
  );
  await jobState.addRelationships(relationships);
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'fetch-account',
    name: 'Fetch Account related data',
    entities: [
      { _class: 'Account', _type: 'snipeit_account', resourceName: 'Account' },
      { _class: 'Service', _type: 'snipeit_service', resourceName: 'Service' },
      { _class: 'Site', _type: 'location', resourceName: 'Location' },
    ],
    relationships: [
      {
        _class: RelationshipClass.PROVIDES,
        _type: 'snipeit_account_provides_service',
        sourceType: 'snipeit_account',
        targetType: 'snipeit_service',
      },
      {
        _class: RelationshipClass.MANAGES,
        _type: 'snipeit_account_manages_location',
        sourceType: 'snipeit_account',
        targetType: 'location',
      },
    ],
    executionHandler: fetchAccount,
  },
];
