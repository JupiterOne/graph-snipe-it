import {
  createDirectRelationship,
  Entity,
  IntegrationProviderAPIError,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import * as cheerio from 'cheerio';
import { createServicesClient } from '../../collector';
import { convertConsumable } from './converter';
import { IntegrationConfig } from '../../types';
import { ACCOUNT_ENTITY_KEY } from '../fetch-account';
import { Steps, Entities, Relationships } from '../constants';
import { getUserKey } from '../fetch-users/converter';
import { ServicesClient } from '../../collector/ServicesClient';

export async function fetchConsumableResources({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createServicesClient(instance);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  let consumableResources: Awaited<
    ReturnType<ServicesClient['listConsumables']>
  >;

  try {
    consumableResources = await client.listConsumables();
  } catch (err) {
    if (err instanceof IntegrationProviderAPIError && err.status === 403) {
      logger.info(
        `Skipped step "${Steps.CONSUMABLES}". The required permission was not provided to perform this step.`,
      );
      return;
    }
    throw err;
  }

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
        if (consumableUser.name) {
          const $ = cheerio.load(consumableUser.name);
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
    entities: [Entities.CONSUMABLE],
    relationships: [Relationships.ACCOUNT_HAS_CONSUMABLE],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchConsumableResources,
  },
  {
    id: Steps.BUILD_USER_CONSUMABLES_RELATIONSHIPS,
    name: 'Build relationship between Snipe-IT users and consumables',
    entities: [],
    relationships: [Relationships.USER_USES_CONSUMABLE],
    dependsOn: [Steps.USERS, Steps.CONSUMABLES],
    executionHandler: buildUserConsumableRelationships,
  },
];
