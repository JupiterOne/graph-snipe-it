import {
  Entity,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Location } from '../../collector';
import {
  createAccountAssignEntity,
  createLocationAssignEntity,
  createServiceAssignEntity,
} from '../../entities';

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
  return createAccountAssignEntity({
    _key: getAccountKey(instance.id),
    name: instance.name,
    displayName: instance.name,
    description: instance.description,
  });
}

export function getServiceEntity(instance: any): Entity {
  return createServiceAssignEntity({
    _key: getServiceKey(instance.id),
    name: 'Snipe-IT ITAM',
    displayName: 'Snipe-IT ITAM',
    description: 'IT Asset Management (ITAM)',
    category: ['infrastructure'],
    function: ['ITAM'],
  });
}

export function convertLocation(
  data: Location,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: createLocationAssignEntity({
        _key: getLocationKey(data.id),
        id: getLocationKey(data.id),
        displayName: data.name,
        name: data.name,
        locationId: data.id,
        image: data.image,
        address: data.address,
        address2: data.address2,
        city: data.city,
        state: data.state,
        country: data.country,
        zip: data.zip,
        assignedAssetsCount: data.assigned_assets_count,
        assetsCount: data.assets_count,
        rtdAssetsCount: data.rtd_assets_count,
        usersCount: data.users_count,
        currency: data.currency,
        isUpdateActionAvailable: Boolean(data.available_actions?.update),
        isDeleteActionAvailable: Boolean(data.available_actions?.delete),
        isCloneActionAvailable: Boolean(data.available_actions?.clone),
        createdOn: parseTimePropertyValue(data.created_at?.datetime),
        updatedOn: parseTimePropertyValue(data.updated_at?.datetime),
      }),
    },
  });
}
