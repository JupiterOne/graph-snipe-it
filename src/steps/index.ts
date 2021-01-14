import { accountSteps } from './account';
import { hardwareSteps } from './fetch-hardware';

const integrationSteps = [...accountSteps, ...hardwareSteps];

export { integrationSteps };
