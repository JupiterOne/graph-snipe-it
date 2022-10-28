import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';

import { IntegrationConfig } from '../src/types';

export function createStepContext() {
  return createMockStepExecutionContext<IntegrationConfig>({
    instanceConfig: {
      hostname: process.env.HOSTNAME || 'localhost:8000',
      apiToken: process.env.API_TOKEN || 'test',
    },
  });
}
