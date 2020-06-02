import { IntegrationInstance } from '@jupiterone/integration-sdk';
import { ServicesClient } from './ServicesClient';
import { IntegrationConfig } from 'src/types';

export * from './types';

/**
 * Creates a ServicesClient from an integration instance using it's
 * api key.
 */
export function createServicesClient(
  instance: IntegrationInstance<IntegrationConfig>,
): ServicesClient {
  const { hostname, apiToken } = instance.config;

  if (!hostname || !apiToken) {
    throw new Error(
      'Required configuration item "hostname" or "apiToken" is missing on the integration instance config',
    );
  }

  return new ServicesClient({ hostname, apiToken });
}
