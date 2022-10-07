import { createStepContext } from '../../../test';
import { Recording, setupRecording } from '@jupiterone/integration-sdk-testing';

import { fetchLicensedApplications } from './index';
import { fetchAccount } from '../fetch-account';
import { fetchHardwareAssets } from '../fetch-hardware';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('fetchLicensedApplications', async () => {
  recording = setupRecording({
    name: 'fetchLicensedApplications',
    directory: __dirname,
    options: {
      recordFailedRequests: false,
      matchRequestsBy: {
        url: {
          query: false,
        },
      },
    },
  });

  const context = createStepContext();
  await fetchAccount(context);
  await fetchHardwareAssets(context);
  await fetchLicensedApplications(context);

  expect(context.jobState.collectedEntities).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['Account'],
        _type: 'snipeit_account',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['Service'],
        _type: 'snipeit_service',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['Site'],
        _type: 'location',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['Application'],
        _type: 'snipeit_licensed_application',
      }),
    ]),
  );
  expect(context.jobState.collectedRelationships).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        _key: expect.any(String),
        _class: 'PROVIDES',
        _type: 'snipeit_account_provides_service',
        displayName: 'PROVIDES',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: 'MANAGES',
        _type: 'snipeit_account_manages_location',
        displayName: 'MANAGES',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: 'HAS',
        _type: 'snipeit_account_has_licensed_application',
        displayName: 'HAS',
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: 'INSTALLED',
        _type: 'snipeit_licensed_application_installed_hardware',
        displayName: 'INSTALLED',
      }),
    ]),
  );
});
