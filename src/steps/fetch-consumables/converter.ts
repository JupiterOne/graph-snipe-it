import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { SnipeItConsumable } from '../../collector';
import { createConsumableAssignEntity } from '../../entities';

export function getConsumableKey(id: number): string {
  return `snipeit_consumable_resource:${id}`;
}

export function convertConsumable(
  data: SnipeItConsumable,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: createConsumableAssignEntity({
        _key: getConsumableKey(data.id),
        id: getConsumableKey(data.id),
        consumableId: data.id,
        displayName: data.name,
        name: data.name,
        image: data.image,
        'category.id': data.category?.id,
        categoryId: data.category?.id,
        'category.name': data.category?.name,
        categoryName: data.category?.name,
        'company.id': data.company?.id,
        companyId: data.company?.id,
        'company.name': data.company?.name,
        companyName: data.company?.name,
        itemNo: data.item_no,
        'location.id': data.location?.id,
        locationId: data.location?.id,
        'location.name': data.location?.name,
        locationName: data.location?.name,
        'manufacturer.id': data.manufacturer?.id,
        manufacturerId: data.manufacturer?.id,
        'manufacturer.name': data.manufacturer?.name,
        manufacturerName: data.manufacturer?.name,
        minAmt: data.min_amt,
        modelNumber: data.model_number,
        remaining: data.remaining,
        orderNumber: data.order_number,
        purchaseCost: data.purchase_cost,
        purchaseDate: parseTimePropertyValue(data.purchase_date?.datetime),
        purchasedOn: parseTimePropertyValue(data.purchase_date?.datetime),
        qty: data.qty,
        notes: data.notes ? [data.notes] : undefined,
        createdOn: parseTimePropertyValue(data.created_at?.datetime),
        updatedOn: parseTimePropertyValue(data.updated_at?.datetime),
        userCanCheckout: data.user_can_checkout,
        isUserAbleToCheckout: data.user_can_checkout,
        'availableActions.checkout': data.available_actions?.checkout,
        isCheckoutActionAvailable: data.available_actions?.checkout,
        'availableActions.checkin': data.available_actions?.checkin,
        isCheckinActionAvailable: data.available_actions?.checkin,
        'availableActions.update': data.available_actions?.update,
        isUpdateActionAvailable: data.available_actions?.update,
        'availableActions.delete': data.available_actions?.delete,
        isDeleteActionAvailable: data.available_actions?.delete,
      }),
    },
  });
}
