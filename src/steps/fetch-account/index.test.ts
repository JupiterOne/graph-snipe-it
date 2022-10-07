import { createStepContext } from '../../../test';
import { Recording, setupRecording } from '@jupiterone/integration-sdk-testing';

import { fetchAccount } from './index';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('fetchAccount', async () => {
  recording = setupRecording({
    name: 'fetchAccount',
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
    ]),
  );
});
