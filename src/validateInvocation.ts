import {
  IntegrationExecutionContext,
  IntegrationInstance,
} from '@jupiterone/integration-sdk';

import { createServicesClient } from './collector';

export default async function validateInvocation(
  context: IntegrationExecutionContext,
): Promise<void> {
  context.logger.info(
    {
      instance: context.instance,
    },
    'Validating integration config...',
  );

  if (await isConfigurationValid(context.instance)) {
    context.logger.info('Integration instance is valid!');
  } else {
    throw new Error('Failed to authenticate with provided credentials');
  }
}

async function isConfigurationValid(
  instance: IntegrationInstance,
): Promise<boolean> {
  // perform test api call. This will fail if we do not have access.
  try {
    const client = createServicesClient(instance);
    await client.test();
    return true;
  } catch (err) {
    return false;
  }
}
