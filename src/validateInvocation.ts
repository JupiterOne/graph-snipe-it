import {
  IntegrationExecutionContext,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { createServicesClient } from './collector';
import { IntegrationConfig } from './types';

export default async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
): Promise<void> {
  try {
    const client = createServicesClient(context.instance);
    await client.test();
  } catch (err) {
    throw new IntegrationProviderAuthenticationError({
      cause: err,
      endpoint: context.instance.config['hostname'],
      status: 302,
      statusText: 'Redirecting to login',
    });
  }
}
