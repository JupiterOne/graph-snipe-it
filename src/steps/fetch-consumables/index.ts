import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import * as cheerio from 'cheerio';
import { ConsumableUser, createServicesClient } from '../../collector';
import { convertConsumable } from './converter';
import { IntegrationConfig } from '../../types';
import { ACCOUNT_ENTITY_KEY } from '../fetch-account';
import { Steps, Entities, Relationships } from '../constants';
import { getUserKey } from '../fetch-users/converter';

export async function fetchConsumableResources({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  const consumableResources = await client.listConsumables();
  const consumableResourceEntities = consumableResources.map(convertConsumable);
  await jobState.addEntities(consumableResourceEntities);

  const relationships = consumableResourceEntities.map(
    (consumableResourceEntity) =>
      createDirectRelationship({
        from: accountEntity,
        to: consumableResourceEntity,
        _class: RelationshipClass.HAS,
      }),
  );
  await jobState.addRelationships(relationships);
}

export async function buildUserConsumableRelationships({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance);

  await jobState.iterateEntities(
    { _type: Entities.CONSUMABLE._type },
    async (consumableEntity) => {
      const consumableUsers = await client.listConsumableUsers(
        consumableEntity.consumableId as string,
      );

      // currently, the list of users that use a consumables is returned
      // as a list of HTML elements containing URL links to those users
      // cheerio, a jQuery implementation for the server side, is used
      // to easily manipulate the HTML elements and retrieve the user Id
      consumableUsers.map(async (consumableUser) => {
        if ((consumableUser as ConsumableUser).name) {
          const $ = cheerio.load((consumableUser as ConsumableUser).name);
          const userLink = $('a').attr('href') as string;
          const userId = userLink.split('/').pop() as string;

          const userEntity = await jobState.findEntity(getUserKey(userId));

          if (userEntity) {
            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.USES,
                from: userEntity,
                to: consumableEntity,
              }),
            );
          }
        }
      });
    },
  );
}

export const consumablesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.CONSUMABLES,
    name: 'Fetch Snipe-IT listing of consumable resources',
    entities: [
      {
        _class: Entities.CONSUMABLE._class,
        _type: Entities.CONSUMABLE._type,
        resourceName: Entities.CONSUMABLE.resourceName,
      },
    ],
    relationships: [
      {
        _class: Relationships.ACCOUNT_HAS_CONSUMABLE._class,
        _type: Relationships.ACCOUNT_HAS_CONSUMABLE._type,
        sourceType: Relationships.ACCOUNT_HAS_CONSUMABLE.sourceType,
        targetType: Relationships.ACCOUNT_HAS_CONSUMABLE.targetType,
      },
    ],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchConsumableResources,
  },
  {
    id: Steps.BUILD_USER_CONSUMABLES_RELATIONSHIPS,
    name: 'Build relationship between Snipe-IT users and consumables',
    entities: [],
    relationships: [
      {
        _class: Relationships.USER_USES_CONSUMABLE._class,
        _type: Relationships.USER_USES_CONSUMABLE._type,
        sourceType: Relationships.USER_USES_CONSUMABLE.sourceType,
        targetType: Relationships.USER_USES_CONSUMABLE.targetType,
      },
    ],
    dependsOn: [Steps.USERS, Steps.CONSUMABLES],
    executionHandler: buildUserConsumableRelationships,
  },
];
