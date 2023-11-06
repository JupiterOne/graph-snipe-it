import {
  createIntegrationEntity,
  createMappedRelationship,
  Entity,
  MappedRelationship,
  parseTimePropertyValue,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';

import { SnipeItHardware } from '../../collector';
import { Entities, MappedRelationships } from '../constants';
import { getLocationKey } from '../fetch-account/converter';

export function getHardwareKey(id: number): string {
  return `snipeit_hardware:${id}`;
}

export function convertHardware(
  data: SnipeItHardware,
): ReturnType<typeof createIntegrationEntity> {
  const hardwareId = data.id;
  const hardwareKey = getHardwareKey(hardwareId);
  const manufacturer = data.manufacturer?.name ?? null;
  const user = data.assigned_to?.type === 'user' ? data.assigned_to : undefined;
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
        _key: hardwareKey,
        _type: Entities.HARDWARE._type,
        _class: Entities.HARDWARE._class,
        id: String(hardwareId),
        deviceId: String(hardwareId),
        name: data.name,
        displayName,
        assignedType: data.assigned_to?.type,
        assignedName: data.assigned_to?.name,
        assetTag: data.asset_tag,
        category: data.category?.name ?? null,
        make: manufacturer,
        model: data.model?.name ?? null,
        serial: data.serial,
        byod: data.byod,
        cost: Number(data.purchase_cost),
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
        statusMeta: data.status_label.status_meta,
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
        _class: Entities.HARDWARE._class,
        id: hardware.id,
        locationId: hardware.locationId as number,
      },
      skipTargetCreation: true,
    },
  });
}
