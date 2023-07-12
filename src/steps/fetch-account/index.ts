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
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance, logger);

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
    entities: [
      {
        _class: Entities.ACCOUNT._class,
        _type: Entities.ACCOUNT._type,
        resourceName: Entities.ACCOUNT.resourceName,
      },
      {
        _class: Entities.SERVICE._class,
        _type: Entities.SERVICE._type,
        resourceName: Entities.SERVICE.resourceName,
      },
      {
        _class: Entities.LOCATION._class,
        _type: Entities.LOCATION._type,
        resourceName: Entities.LOCATION.resourceName,
      },
    ],
    relationships: [
      {
        _class: Relationships.ACCOUNT_PROVIDES_SERVICE._class,
        _type: Relationships.ACCOUNT_PROVIDES_SERVICE._type,
        sourceType: Relationships.ACCOUNT_PROVIDES_SERVICE.sourceType,
        targetType: Relationships.ACCOUNT_PROVIDES_SERVICE.targetType,
      },
      {
        _class: Relationships.ACCOUNT_MANAGES_LOCATION._class,
        _type: Relationships.ACCOUNT_MANAGES_LOCATION._type,
        sourceType: Relationships.ACCOUNT_MANAGES_LOCATION.sourceType,
        targetType: Relationships.ACCOUNT_MANAGES_LOCATION.targetType,
      },
    ],
    executionHandler: fetchAccount,
  },
];
