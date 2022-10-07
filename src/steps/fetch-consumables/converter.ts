import {
  createIntegrationEntity,
  convertProperties,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { SnipeItConsumable } from '../../collector';
import { Entities } from '../constants';

export function getConsumableKey(id: string): string {
  return `snipeit_consumable_resource:${id}`;
}

export function convertConsumable(
  data: SnipeItConsumable,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        ...convertProperties(data),
        _key: getConsumableKey(data.id),
        _type: Entities.CONSUMABLE._type,
        _class: Entities.CONSUMABLE._class,
        id: getConsumableKey(data.id),
        consumableId: data.id,
        displayName: data.name,
        image: data.image,
        'category.id': data.category?.id,
        'category.name': data.category?.name,
        'company.id': data.company?.id,
        'company.name': data.company?.name,
        itemNo: data.item_no,
        location: data.location,
        'location.id': data.location?.id,
        'location.name': data.location?.name,
        'manufacturer.id': data.manufacturer?.id,
        'manufacturer.name': data.manufacturer?.name,
        minAmt: data.min_amt,
        modelNumber: data.model_number,
        remaining: data.remaining,
        orderNumber: data.order_number,
        purchaseCost: data.purchase_cost,
        purchaseDate: parseTimePropertyValue(data.purchase_date?.date),
        qty: data.qty,
        notes: data.notes ? [data.notes] : undefined,
        createdOn: parseTimePropertyValue(data.created_at?.datetime),
        updatedOn: parseTimePropertyValue(data.updated_at?.datetime),
        userCanCheckout: data.user_can_checkout,
        'availableActions.checkout': data.available_actions?.checkout,
        'availableActions.checkin': data.available_actions?.checkin,
        'availableActions.update': data.available_actions?.update,
        'availableActions.delete': data.available_actions?.delete,
      },
    },
  });
}
