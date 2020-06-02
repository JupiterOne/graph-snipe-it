/* eslint-disable @typescript-eslint/camelcase */
import { createStepContext } from 'test';
import { Recording, setupRecording } from '@jupiterone/integration-sdk/testing';

import step from '../index';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('should process hardware entities', async () => {
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
  await step.executionHandler(context);

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
    ]),
  );
});
