import { createStepContext } from '../../../../test';
import { Recording, setupRecording } from '@jupiterone/integration-sdk-testing';

import { fetchHardwareAssets } from '../index';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test.skip('should process hardware entities', async () => {
  jest.setTimeout(10000);

  recording = setupRecording({
    name: 'snipeit_hardware',
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
  await fetchHardwareAssets(context);

  expect(context.jobState.collectedRelationships).toHaveLength(2651);
  expect(context.jobState.collectedRelationships).toEqual(
    expect.arrayContaining([
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
            _class: 'Device',
            id: expect.any(String),
            locationId: expect.any(Number),
          }),
          skipTargetCreation: true,
        },
      }),
    ]),
  );
});
