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

describe('fetch-users', () => {
  test('success', async () => {
    recording = setupSnipeItRecording({
      name: 'fetch-users',
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

    const stepConfig = buildStepTestConfig(Steps.USERS);
    const stepResults = await executeStepWithDependencies(stepConfig);
    const { collectedEntities, collectedRelationships } = stepResults;

    expect(collectedEntities.length > 0);
    expect(collectedEntities).toMatchGraphObjectSchema(Entities.USER);
    expect(collectedRelationships.length > 0);
  });
});
