import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from '../../collector';
import { convertUser, createUserPersonMappedRelationship } from './converter';
import { IntegrationConfig } from '../../types';
import { ACCOUNT_ENTITY_KEY } from '../fetch-account';
import {
  Entities,
  MappedRelationships,
  Relationships,
  Steps,
} from '../constants';

export async function fetchUsers({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance, logger);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  const users = await client.listUsers();
  const userEntities = users.map(convertUser);
  await jobState.addEntities(userEntities);

  userEntities.map(async (userEntity) => {
    await jobState.addRelationships([
      createDirectRelationship({
        from: accountEntity,
        to: userEntity,
        _class: RelationshipClass.HAS,
      }),
      createUserPersonMappedRelationship(userEntity),
    ]);
  });
}

export const usersSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Snipe-IT listing of users',
    entities: [Entities.USER],
    relationships: [Relationships.ACCOUNT_HAS_USER],
    mappedRelationships: [MappedRelationships.USER_IS_PERSON],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchUsers,
  },
];
