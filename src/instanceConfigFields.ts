import { IntegrationInstanceConfigFieldMap } from '@jupiterone/integration-sdk-core';

const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  hostname: {
    type: 'string',
  },
  apiToken: {
    type: 'string',
    mask: true,
  },
};

export default instanceConfigFields;
