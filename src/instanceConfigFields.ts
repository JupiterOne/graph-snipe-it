import { IntegrationInstanceConfigFieldMap } from '@jupiterone/integration-sdk';

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
