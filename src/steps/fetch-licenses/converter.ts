import {
  createIntegrationEntity,
  parseTimePropertyValue,
  Entity,
  MappedRelationship,
  createMappedRelationship,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';
import { HardwareLicense } from '../../collector';
import { Entities, MappedRelationships } from '../constants';
import { getHardwareKey } from '../fetch-hardware/converter';

export function getLicenseKey(id: string): string {
  return `snipeit_licensed_application:${id}`;
}

export function convertLicense(
  data: HardwareLicense,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: getLicenseKey(String(data.id)),
        _type: Entities.LICENSE._type,
        _class: Entities.LICENSE._class,
        id: getLicenseKey(String(data.id)),
        licenseId: data.id,
        displayName: data.name,
        company: data.company?.name,
        'manufacturer.id': data.manufacturer?.id,
        'manufacturer.name': data.manufacturer?.name,
        productKey: data.product_key,
        orderNumber: data.order_number,
        purchaseOrder: data.purchase_order,
        purchaseDate: parseTimePropertyValue(data.purchase_date?.datetime),
        terminationDate: parseTimePropertyValue(
          data.termination_date?.datetime,
        ),
        depreciation: data.depreciation?.name,
        purchaseCost: data.purchase_cost_numeric ?? data.purchase_cost,
        notes: data.notes ? [data.notes] : undefined,
        expirationDate: parseTimePropertyValue(data.expiration_date?.datetime),
        seats: data.seats,
        freeSeatsCount: data.free_seats_count,
        licenseName: data.license_name,
        licenseEmail: data.license_email,
        reassignable: data.reassignable,
        maintained: data.maintained,
        'supplier.id': data.supplier?.id,
        'supplier.name': data.supplier?.name,
        'category.id': data.category?.id,
        'category.name': data.category?.name,
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

export function createLicenseHardwareMappedRelationship(
  license: Entity,
  hardwareId: number,
): MappedRelationship {
  return createMappedRelationship({
    _key: `${license._key}|installed|${getHardwareKey(hardwareId)}`,
    _class: MappedRelationships.LICENSE_INSTALLED_HARDWARE._class,
    _type: MappedRelationships.LICENSE_INSTALLED_HARDWARE._type,
    _mapping: {
      relationshipDirection: RelationshipDirection.REVERSE,
      sourceEntityKey: license._key,
      targetFilterKeys: [['_class', '_key']],
      targetEntity: {
        _class: Entities.HARDWARE._class,
        _key: getHardwareKey(hardwareId),
      },
      skipTargetCreation: true,
    },
  });
}
