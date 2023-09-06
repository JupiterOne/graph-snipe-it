import {
  IntegrationInstanceConfig,
  IntegrationInstanceConfigFieldMap,
} from '@jupiterone/integration-sdk-core';

export interface IntegrationConfig extends IntegrationInstanceConfig {
  hostname: string;
  apiToken: string;
}

export const instanceConfigFields: IntegrationInstanceConfigFieldMap<IntegrationConfig> = {
  hostname: {
    type: 'string',
  },
  apiToken: {
    type: 'string',
    mask: true,
  },
};
