import { createMockStepExecutionContext } from '@jupiterone/integration-sdk/testing';

export function createStepContext(): ReturnType<
  typeof createMockStepExecutionContext
> {
  return createMockStepExecutionContext({
    instanceConfig: {
      hostname: process.env.HOSTNAME || 'develop.snipeitapp.com',
      apiToken: process.env.API_TOKEN || 'test',
    },
  });
}
