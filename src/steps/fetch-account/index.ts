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
import { Steps, Entities, Relationships } from './../constants';
import { IntegrationConfig } from '../../instanceConfigFields';

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
      properties: {
        // If this is not present, the generated type will be 'snipeit_account_manages_managed_location'. We want it to be 'snipeit_account_manages_location'.
        _type: Relationships.ACCOUNT_MANAGES_LOCATION._type,
      },
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
