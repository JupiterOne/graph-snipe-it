import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';

import { setupSnipeItRecording } from '../../../test/recording';
import { buildStepTestConfig } from '../../../test/config';
import { Entities, Steps } from '../constants';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe('fetch-hardware', () => {
  test('success', async () => {
    recording = setupSnipeItRecording({
      name: 'fetch-hardware',
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

    const stepConfig = buildStepTestConfig(Steps.HARDWARE);
    const stepResults = await executeStepWithDependencies(stepConfig);
    const { collectedEntities, collectedRelationships } = stepResults;

    expect(collectedEntities.length > 0);
    expect(collectedEntities).toMatchGraphObjectSchema(Entities.HARDWARE);
    expect(collectedRelationships.length > 0);
  });
});
