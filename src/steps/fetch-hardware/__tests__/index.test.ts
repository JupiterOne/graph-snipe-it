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

  expect(context.jobState.collectedEntities).toHaveLength(1328);
  expect(context.jobState.collectedEntities).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        _type: 'hardware',
        _class: ['Device'],
        id: expect.any(String),
        displayName: expect.any(String),
        createdOn: expect.any(Number),
      }),
    ]),
  );
});
