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

describe('fetch-account', () => {
  test('success', async () => {
    recording = setupSnipeItRecording({
      name: 'fetch-account',
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

    const stepConfig = buildStepTestConfig(Steps.ACCOUNT);
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
  });
});
