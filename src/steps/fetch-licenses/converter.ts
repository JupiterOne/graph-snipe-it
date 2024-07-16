import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { HardwareLicense } from '../../collector';
import { createLicenseAssignEntity } from '../../entities';

export function getLicenseKey(id: string): string {
  return `snipeit_licensed_application:${id}`;
}

export function convertLicense(
  data: HardwareLicense,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: createLicenseAssignEntity({
        _key: getLicenseKey(String(data.id)),
        id: getLicenseKey(String(data.id)),
        licenseId: data.id,
        displayName: data.name,
        name: data.name,
        company: data.company?.name,
        'manufacturer.id': data.manufacturer?.id,
        manufacturerId: data.manufacturer?.id,
        'manufacturer.name': data.manufacturer?.name,
        manufacturerName: data.manufacturer?.name,
        productKey: data.product_key,
        orderNumber: data.order_number,
        purchaseOrder: data.purchase_order,
        purchaseDate: parseTimePropertyValue(data.purchase_date?.datetime),
        purchasedOn: parseTimePropertyValue(data.purchase_date?.datetime),
        terminationDate: parseTimePropertyValue(
          data.termination_date?.datetime,
        ),
        terminationOn: parseTimePropertyValue(data.termination_date?.datetime),
        depreciation: data.depreciation?.name,
        purchaseCost: data.purchase_cost_numeric ?? data.purchase_cost,
        notes: data.notes ? [data.notes] : undefined,
        expirationDate: parseTimePropertyValue(data.expiration_date?.datetime),
        expirationOn: parseTimePropertyValue(data.expiration_date?.datetime),
        seats: data.seats,
        freeSeatsCount: data.free_seats_count,
        licenseName: data.license_name,
        licenseEmail: data.license_email,
        reassignable: data.reassignable,
        maintained: data.maintained,
        'supplier.id': data.supplier?.id,
        supplierId: data.supplier?.id,
        'supplier.name': data.supplier?.name,
        supplierName: data.supplier?.name,
        'category.id': data.category?.id,
        categoryId: data.category?.id,
        'category.name': data.category?.name,
        categoryName: data.category?.name,
        createdOn: parseTimePropertyValue(data.created_at?.datetime),
        updatedOn: parseTimePropertyValue(data.updated_at?.datetime),
        userCanCheckout: data.user_can_checkout,
        'availableActions.checkout': data.available_actions?.checkout,
        availableActionsCheckout: data.available_actions?.checkout,
        'availableActions.checkin': data.available_actions?.checkin,
        availableActionsCheckin: data.available_actions?.checkin,
        'availableActions.update': data.available_actions?.update,
        availableActionsUpdate: data.available_actions?.update,
        'availableActions.delete': data.available_actions?.delete,
        availableActionsDelete: data.available_actions?.delete,
      }),
    },
  });
}
