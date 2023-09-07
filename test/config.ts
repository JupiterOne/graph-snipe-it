import * as dotenv from 'dotenv';
import * as path from 'path';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import { invocationConfig } from '../src';
import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../src/instanceConfigFields';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

export function buildStepTestConfig(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: config,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}

export const config: IntegrationConfig = {
  hostname: process.env.HOSTNAME || '127.0.0.1:8080',
  apiToken: process.env.API_TOKEN || 'apiToken',
};
