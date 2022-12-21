/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createIntegrationEntity,
  createMappedRelationship,
  Entity,
  MappedRelationship,
  parseTimePropertyValue,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';

import { HardwareAsset, SnipeItUser } from '../../collector';
import { Entities, MappedRelationships } from '../constants';
import { getLocationKey } from '../fetch-account/converter';

export function getHardwareKey(id: string): string {
  return `hardware:${id}`;
}

export function convertHardware(
  data: HardwareAsset,
  user?: SnipeItUser,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: getHardwareKey(data.id.toString()),
        _type: Entities.HARDWARE._type,
        _class: Entities.HARDWARE._class,
        id: getHardwareKey(data.id.toString()),
        assetId: data.id,
        deviceId: `${data.id}`,
        displayName: data.name,
        username: user?.username || data.assigned_to?.username,
        userId: user?.id || data.assigned_to?.id,
        email: user?.email,
        assetTag: data.asset_tag,
        category: data.category?.name,
        manufacturer: data.manufacturer?.name || 'unknown',
        make: data.manufacturer?.name || 'unknown',
        model: data.model?.name || 'unknown',
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
        createdOn: parseTimePropertyValue(data.created_at?.datetime),
        updatedOn: parseTimePropertyValue(data.updated_at?.datetime),
        modelNumber: data.model_number,
        orderNumber: data.order_number,
        company: data.company,
        rtdLocation: data.rtd_location?.name,
        image: data.image,
        qr: data.qr,
        purchaseOn: parseTimePropertyValue(data.purchase_date?.date),
        purchaseCost: data.purchase_cost,
        checkinCounter: data.checkin_counter,
        checkoutCounter: data.checkout_counter,
        requestsCounter: data.requests_counter,
        userCanCheckout: data.user_can_checkout,
        isCheckoutAvailable: data.available_actions?.checkout,
        isCheckinAvailable: data.available_actions?.checkin,
        isCloneAvailable: data.available_actions?.clone,
        isRestoreAvailable: data.available_actions?.restore,
        isUpdateAvailable: data.available_actions?.update,
        isDeleteAvailable: data.available_actions?.delete,
      },
    },
  });
}

export function mapHardwareRelationship(
  account: Entity,
  hardware: Entity,
  filterKey: string,
): MappedRelationship {
  return createMappedRelationship({
    _key: `${account._key}|manages|${hardware._key}`,
    _class: MappedRelationships.ACCOUNT_MANAGES_HARDWARE._class,
    _type: MappedRelationships.ACCOUNT_MANAGES_HARDWARE._type,
    _mapping: {
      relationshipDirection: RelationshipDirection.FORWARD,
      sourceEntityKey: account._key,
      targetFilterKeys: [['_class', filterKey]],
      targetEntity: {
        _key: hardware._key,
        _type: hardware._type,
        _class: hardware._class,
        id: hardware.id,
        displayName: hardware.displayName,
        createdOn: hardware.createdOn as number,
      },
    },
  });
}

export function mapHardwareLocationRelationship(
  hardware: Entity,
): MappedRelationship {
  return createMappedRelationship({
    _key: `${getLocationKey(hardware.locationId as string)}|has|${
      hardware._key
    }`,
    _class: MappedRelationships.LOCATION_HAS_HARDWARE._class,
    _type: MappedRelationships.LOCATION_HAS_HARDWARE._type,
    _mapping: {
      relationshipDirection: RelationshipDirection.FORWARD,
      sourceEntityKey: getLocationKey(hardware.locationId as string),
      targetFilterKeys: [['_class', 'id', 'locationId']],
      targetEntity: {
        _class: Entities.HARDWARE._class,
        id: hardware.id,
        locationId: hardware.locationId as number,
      },
      skipTargetCreation: true,
    },
  });
}
