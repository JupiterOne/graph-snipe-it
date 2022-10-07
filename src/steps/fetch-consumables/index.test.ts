import { createStepContext } from '../../../test';
import { Recording, setupRecording } from '@jupiterone/integration-sdk-testing';

import {
  buildUserConsumableRelationships,
  fetchConsumableResources,
} from './index';
import { fetchAccount } from '../fetch-account';
import { fetchUsers } from '../fetch-users';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('fetchConsumableResources', async () => {
  recording = setupRecording({
    name: 'fetchConsumableResources',
    directory: __dirname,
    options: {
      recordFailedRequests: false,
      matchRequestsBy: {
        url: {
          query: false,
        },
      },
    },
  });

  const context = createStepContext();
  await fetchAccount(context);
  await fetchConsumableResources(context);

  expect(context.jobState.collectedEntities).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['Account'],
        _type: 'snipeit_account',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['Service'],
        _type: 'snipeit_service',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['Site'],
        _type: 'location',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['Resource'],
        _type: 'snipeit_consumable_resource',
      }),
    ]),
  );
  expect(context.jobState.collectedRelationships).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        _key: expect.any(String),
        _class: 'PROVIDES',
        _type: 'snipeit_account_provides_service',
        displayName: 'PROVIDES',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: 'MANAGES',
        _type: 'snipeit_account_manages_location',
        displayName: 'MANAGES',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: 'HAS',
        _type: 'snipeit_account_has_consumable_resource',
        displayName: 'HAS',
      }),
    ]),
  );
});

test('buildUserConsumableRelationships', async () => {
  recording = setupRecording({
    name: 'buildUserConsumableRelationships',
    directory: __dirname,
    options: {
      recordFailedRequests: false,
      matchRequestsBy: {
        url: {
          query: false,
        },
      },
    },
  });

  const context = createStepContext();
  await fetchAccount(context);
  await fetchUsers(context);
  await fetchConsumableResources(context);
  await buildUserConsumableRelationships(context);

  expect(context.jobState.collectedEntities).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['Account'],
        _type: 'snipeit_account',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['Service'],
        _type: 'snipeit_service',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['Site'],
        _type: 'location',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['Resource'],
        _type: 'snipeit_consumable_resource',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['User'],
        _type: 'snipeit_user',
      }),
    ]),
  );
  expect(context.jobState.collectedRelationships).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        _key: expect.any(String),
        _class: 'PROVIDES',
        _type: 'snipeit_account_provides_service',
        displayName: 'PROVIDES',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: 'MANAGES',
        _type: 'snipeit_account_manages_location',
        displayName: 'MANAGES',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: 'HAS',
        _type: 'snipeit_account_has_consumable_resource',
        displayName: 'HAS',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: 'HAS',
        _type: 'snipeit_account_has_user',
        displayName: 'HAS',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: 'USES',
        _type: 'snipeit_user_uses_consumable_resource',
        displayName: 'USES',
      }),
    ]),
  );
});
