import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import {
  convertLocation,
  getAccountEntity,
  getServiceEntity,
} from './converter';
import { IntegrationConfig } from '../../types';
import { Steps, Entities, Relationships } from './../constants';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export async function fetchAccount({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance);

  const accountEntity = getAccountEntity(instance);
  await jobState.addEntity(accountEntity);
  await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);

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
    id: Steps.ACCOUNT,
    name: 'Fetch Account related data',
    entities: [Entities.ACCOUNT, Entities.SERVICE, Entities.LOCATION],
    relationships: [
      Relationships.ACCOUNT_PROVIDES_SERVICE,
      Relationships.ACCOUNT_MANAGES_LOCATION,
    ],
    executionHandler: fetchAccount,
  },
];
