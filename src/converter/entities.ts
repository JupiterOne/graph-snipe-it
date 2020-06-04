/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createIntegrationEntity,
  getTime,
  convertProperties,
  Entity,
} from '@jupiterone/integration-sdk-core';

export const getAccountEntity = (instance: any): Entity => ({
  _key: `snipe-it:account:${instance.id}`,
  _type: 'snipeit_account',
  _class: ['Account'],
  name: instance.name,
  displayName: instance.name,
  description: instance.description,
});

export const getServiceEntity = (instance: any): Entity => ({
  _key: `snipe-it:service:${instance.id}:itam`,
  _type: 'snipeit_service',
  _class: ['Service'],
  name: 'Snipe-IT ITAM',
  displayName: 'Snipe-IT ITAM',
  description: 'IT Asset Management (ITAM)',
  category: 'infrastructure',
  function: 'ITAM',
});

export const convertHardware = (
  data: any,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        ...convertProperties(data),
        _key: `hardware:${data.id}`,
        _type: 'hardware',
        _class: ['Device'],
        id: `hardware:${data.id}`,
        assetId: data.id,
        displayName: data.name,
        activatedOn: getTime(data.activated_on),
        username: data.assigned_to?.user_name,
        assetTag: data.asset_tag,
        category: data.category?.name,
        manufacturer: data.manufacturer?.name,
        make: data.manufacturer?.name,
        model: data.model?.name,
        serial: data.serial,
        supplier: data.supplier?.name,
        EOL: !!data.eol,
        status:
          data.status_label?.status_meta === 'deployable'
            ? 'ready'
            : data.status_label?.name?.match(/broken/i)
            ? 'defective'
            : data.status_label?.status_meta,
        notes: data.notes ? [data.notes] : undefined,
        location: data.location?.name,
        locationId: data.location?.id,
        createdOn: getTime(data.created_at?.datetime),
        updatedOn: getTime(data.updated_at?.datetime),
      },
    },
  });

export const convertLocation = (
  data: any,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        ...convertProperties(data),
        _key: `location:${data.id}`,
        _type: 'location',
        _class: ['Site'],
        id: `location:${data.id}`,
        locationId: data.id,
        displayName: data.name,
        createdOn: getTime(data.created_at?.datetime),
        updatedOn: getTime(data.updated_at?.datetime),
      },
    },
  });
