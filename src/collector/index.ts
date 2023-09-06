import {
  IntegrationInstance,
  IntegrationLogger,
} from '@jupiterone/integration-sdk-core';
import { ServicesClient } from './ServicesClient';
import { IntegrationConfig } from '../types';

export * from './types';

/**
 * Creates a ServicesClient from an integration instance using it's
 * api key.
 */
export function createServicesClient(
  instance: IntegrationInstance<IntegrationConfig>,
  logger: IntegrationLogger,
): ServicesClient {
  const { hostname, apiToken } = instance.config;

  if (!hostname || !apiToken) {
    throw new Error(
      'Required configuration item "hostname" or "apiToken" is missing on the integration instance config',
    );
  }

  return new ServicesClient({ hostname, apiToken }, logger);
}
