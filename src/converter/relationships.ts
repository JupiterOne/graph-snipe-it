import {
  convertProperties,
  createMappedRelationship,
  Entity,
  MappedRelationship,
  RelationshipClass,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';

export const DEVICE_MANAGEMENT_RELATIONSHIP =
  'snipeit_account_manages_hardware';
export const DEVICE_LOCATION_RELATIONSHIP = 'site_has_hardware';

export function mapHardwareRelationship(
  account: Entity,
  hardware: Entity,
  filterKey: string,
): MappedRelationship {
  return createMappedRelationship({
    _key: `${account._key}|manages|${hardware._key}`,
    _class: RelationshipClass.MANAGES,
    _type: DEVICE_MANAGEMENT_RELATIONSHIP,
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
    _key: `location:${hardware.locationId}|has|${hardware._key}`,
    _class: RelationshipClass.HAS,
    _type: DEVICE_LOCATION_RELATIONSHIP,
    _mapping: {
      relationshipDirection: RelationshipDirection.FORWARD,
      sourceEntityKey: `location:${hardware.locationId}`,
      targetFilterKeys: [['_class', 'id', 'locationId']],
      targetEntity: {
        _class: 'Device',
        id: hardware.id,
        locationId: hardware.locationId as number,
      },
      skipTargetCreation: true,
    },
  });
}
