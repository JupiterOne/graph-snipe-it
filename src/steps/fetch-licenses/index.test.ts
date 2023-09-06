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

describe('fetch-licenses', () => {
  test('success', async () => {
    recording = setupSnipeItRecording({
      name: 'fetch-licenses',
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

    const stepConfig = buildStepTestConfig(Steps.LICENSES);
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
  });
});
