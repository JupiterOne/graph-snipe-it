import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';

import {
  IntegrationConfig,
  instanceConfigFields,
} from './instanceConfigFields';
import { integrationSteps } from './steps';
import validateInvocation from './validateInvocation';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> = {
  instanceConfigFields,
  validateInvocation,
  integrationSteps,
};
