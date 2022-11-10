import { IntegrationInstanceConfigFieldMap } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './types';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap<IntegrationConfig> = {
  hostname: {
    type: 'string',
  },
  apiToken: {
    type: 'string',
    mask: true,
  },
};
