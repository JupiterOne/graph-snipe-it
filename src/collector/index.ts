import { IntegrationInstance } from '@jupiterone/integration-sdk';
import { ServicesClient, ServicesClientInput } from './ServicesClient';

export * from './types';

/**
 * Creates a ServicesClient from an integration instance using it's
 * api key.
 */
export function createServicesClient(
  instance: IntegrationInstance,
): ServicesClient {
  const { hostname, apiToken } = instance.config as ServicesClientInput;

  if (!hostname || !apiToken) {
    throw new Error(
      'Required configuration item "hostname" or "apiToken" is missing on the integration instance config',
    );
  }

  return new ServicesClient({ hostname, apiToken });
}
