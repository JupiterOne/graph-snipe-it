import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';

import { setupSnipeItRecording } from '../../../test/recording';
import { buildStepTestConfig } from '../../../test/config';
import { Steps } from '../constants';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('fetch-consumables', () => {
  test('success', async () => {
    recording = setupSnipeItRecording({
      name: 'fetch-consumables',
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

    const stepConfig = buildStepTestConfig(Steps.CONSUMABLES);
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
  });
});

describe('build-user-consumables-relationships', () => {
  test('success', async () => {
    recording = setupSnipeItRecording({
      name: 'build-user-consumables-relationships',
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

    const stepConfig = buildStepTestConfig(
      Steps.BUILD_USER_CONSUMABLES_RELATIONSHIPS,
    );
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
  });
});
