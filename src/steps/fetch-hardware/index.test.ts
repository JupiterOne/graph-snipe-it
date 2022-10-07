import { Recording, setupRecording } from '@jupiterone/integration-sdk-testing';

import { createStepContext } from '../../../test';
import { fetchHardwareAssets } from './index';
import { fetchAccount } from '../fetch-account';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('fetchHardwareAssets', async () => {
  recording = setupRecording({
    name: 'fetchHardwareAssets',
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
  await fetchHardwareAssets(context);

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
        _class: 'MANAGES',
        _type: 'snipeit_account_manages_hardware',
        _mapping: {
          relationshipDirection: 'FORWARD',
          sourceEntityKey: expect.any(String),
          targetFilterKeys: [['_class', 'serial']],
          targetEntity: expect.objectContaining({
            _type: 'hardware',
            _class: ['Device'],
            id: expect.any(String),
            displayName: expect.any(String),
            createdOn: expect.any(Number),
          }),
        },
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: 'HAS',
        _type: 'site_has_hardware',
        _mapping: {
          relationshipDirection: 'FORWARD',
          sourceEntityKey: expect.any(String),
          targetFilterKeys: [['_class', 'id', 'locationId']],
          targetEntity: expect.objectContaining({
            _class: ['Device'],
            id: expect.any(String),
            locationId: expect.any(Number),
          }),
          skipTargetCreation: true,
        },
      }),
    ]),
  );
});
