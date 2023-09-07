import {
  Entity,
  createIntegrationEntity,
  convertProperties,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Location } from '../../collector';
import { Entities } from '../constants';

export function getAccountKey(id: string): string {
  return `snipeit_account:${id}`;
}

export function getServiceKey(id: string): string {
  return `snipeit_service:${id}:itam`;
}

export function getLocationKey(id: number): string {
  return `location:${id}`;
}

export function getAccountEntity(instance: any): Entity {
  return {
    _key: getAccountKey(instance.id),
    _type: Entities.ACCOUNT._type,
    _class: Entities.ACCOUNT._class,
    name: instance.name,
    displayName: instance.name,
    description: instance.description,
  };
}

export function getServiceEntity(instance: any): Entity {
  return {
    _key: getServiceKey(instance.id),
    _type: Entities.SERVICE._type,
    _class: Entities.SERVICE._class,
    name: 'Snipe-IT ITAM',
    displayName: 'Snipe-IT ITAM',
    description: 'IT Asset Management (ITAM)',
    category: ['infrastructure'],
    function: ['ITAM'],
  };
}

export function convertLocation(
  data: Location,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        ...convertProperties(data),
        _key: getLocationKey(data.id),
        _type: Entities.LOCATION._type,
        _class: Entities.LOCATION._class,
        id: getLocationKey(data.id),
        locationId: data.id,
        displayName: data.name,
        createdOn: parseTimePropertyValue(data.created_at?.datetime),
        updatedOn: parseTimePropertyValue(data.updated_at?.datetime),
      },
    },
  });
}
