/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createIntegrationEntity,
  getTime,
  convertProperties,
} from '@jupiterone/integration-sdk';

export const convertHardware = (
  data: any,
): ReturnType<typeof createIntegrationEntity> =>
  createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        ...convertProperties(data),
        _key: `snipe-it:hardware:${data.id}`,
        _type: 'snipeit_hardware',
        _class: ['Device'],
        id: `snipe-it:hardware:${data.id}`,
        assetId: data.id,
        displayName: data.name,
        activatedOn: getTime(data.activated_on),
        assignedUser: data.assigned_to?.user_name,
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
        _key: `snipe-it:location:${data.id}`,
        _type: 'snipeit_location',
        _class: ['Site'],
        id: `snipe-it:location:${data.id}`,
        locationId: data.id,
        displayName: data.name,
        createdOn: getTime(data.created_at?.datetime),
        updatedOn: getTime(data.updated_at?.datetime),
      },
    },
  });
