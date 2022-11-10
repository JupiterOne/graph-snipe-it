import { accountSteps } from './fetch-account';
import { consumablesSteps } from './fetch-consumables';
import { hardwareSteps } from './fetch-hardware';
import { licensesSteps } from './fetch-licenses';
import { usersSteps } from './fetch-users';

const integrationSteps = [
  ...accountSteps,
  ...hardwareSteps,
  ...consumablesSteps,
  ...licensesSteps,
  ...usersSteps,
];

export { integrationSteps };
