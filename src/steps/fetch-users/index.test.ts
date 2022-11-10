import { createStepContext } from '../../../test';
import { Recording, setupRecording } from '@jupiterone/integration-sdk-testing';

import { fetchAccount } from '../fetch-account';
import { fetchUsers } from './index';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('fetchUsers', async () => {
  recording = setupRecording({
    name: 'fetchUsers',
    directory: __dirname,
    options: {
      recordFailedRequests: false,
      matchRequestsBy: {
        url: {
          protocol: false,
          query: false,
        },
      },
    },
  });

  const context = createStepContext();
  await fetchAccount(context);
  await fetchUsers(context);

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
        _type: 'snipeit_account_has_user',
        displayName: 'HAS',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: 'IS',
        _type: 'snipeit_user_is_person',
        _mapping: {
          relationshipDirection: 'FORWARD',
          sourceEntityKey: expect.any(String),
          targetFilterKeys: [['_class', 'username', 'email']],
          targetEntity: expect.objectContaining({
            _class: ['Person'],
            username: expect.any(String),
            email: expect.any(Number),
          }),
          skipTargetCreation: true,
        },
      }),
    ]),
  );
});
