import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';

import instanceConfigFields from './instanceConfigFields';
import validateInvocation from './validateInvocation';

import fetchAccount from './steps/fetch-account';
import fetchHardware from './steps/fetch-hardware';

export const invocationConfig: IntegrationInvocationConfig = {
  instanceConfigFields,
  validateInvocation,
  integrationSteps: [fetchAccount, fetchHardware],
};
