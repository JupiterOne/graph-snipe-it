/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  convertProperties,
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
  const hardwareId = data.id;
  const hardwareKey = getHardwareKey(hardwareId);
  const manufacturer = data.manufacturer?.name ?? null;
  const deviceUsersName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.email || user?.username || 'Unknown User';
  const displayName =
    data.name ||
    data.serial ||
    `${deviceUsersName}'s ${data.model?.name || 'Device'}`;

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        ...convertProperties(data),
        _key: hardwareKey,
        _type: Entities.HARDWARE._type,
        _class: Entities.HARDWARE._class,
        id: hardwareKey,
        assetId: hardwareId,
        deviceId: String(hardwareId),
        name: data.name,
        displayName,
        activatedOn: parseTimePropertyValue(data.activated_on),
        username: user?.username || data.assigned_to?.username,
        userId: user?.id || data.assigned_to?.id,
        email: user?.email,
        assetTag: data.asset_tag,
        category: data.category?.name ?? null,
        manufacturer,
        make: manufacturer,
        model: data.model?.name ?? null,
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
        lastSeenOn: [
          parseTimePropertyValue(data.last_checkout?.datetime),
          parseTimePropertyValue(data.updated_at?.datetime),
        ].sort()[0],
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
        ...convertProperties(hardware),
        _key: hardware._key,
        _type: hardware._type,
        _class: hardware._class,
      },
    },
  });
}

export function mapHardwareLocationRelationship(
  hardware: Entity,
): MappedRelationship {
  return createMappedRelationship({
    _key: `${getLocationKey(hardware.locationId as number)}|has|${
      hardware._key
    }`,
    _class: MappedRelationships.LOCATION_HAS_HARDWARE._class,
    _type: MappedRelationships.LOCATION_HAS_HARDWARE._type,
    _mapping: {
      relationshipDirection: RelationshipDirection.FORWARD,
      sourceEntityKey: getLocationKey(hardware.locationId as number),
      targetFilterKeys: [['_class', 'id', 'locationId']],
      targetEntity: {
        // not sure if it was inteded, but previously,
        // _class was a string, not an array.
        _class: Entities.HARDWARE._class,
        id: hardware.id,
        locationId: hardware.locationId as number,
      },
      skipTargetCreation: true,
    },
  });
}
