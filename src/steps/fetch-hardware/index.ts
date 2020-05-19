import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk';

import { createServicesClient } from '../../collector';
import { convertHardware } from '../../converter';

const step: IntegrationStep = {
  id: 'fetch-hardware',
  name: 'Fetch Snipe-IT listing of hardware assets',
  types: ['snipeit_hardware'],
  async executionHandler({
    instance,
    jobState,
  }: IntegrationStepExecutionContext) {
    const client = createServicesClient(instance);

    const hardware = await client.listHardware();
    const entities = hardware.map(convertHardware);
    await jobState.addEntities(entities);
  },
};

export default step;
