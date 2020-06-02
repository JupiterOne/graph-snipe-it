import {
  createIntegrationRelationship,
  Entity,
  Relationship,
  RelationshipDirection,
  convertProperties,
} from '@jupiterone/integration-sdk';

export const DEVICE_MANAGEMENT_RELATIONSHIP =
  'snipeit_account_manages_hardware';
export const DEVICE_LOCATION_RELATIONSHIP = 'site_has_hardware';

export const mapHardwareRelationship = (
  account: Entity,
  hardware: Entity,
  filterKey: string,
): Relationship =>
  createIntegrationRelationship({
    _key: `${account._key}|manages|${hardware._key}`,
    _class: 'MANAGES',
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

export const mapHardwareLocationRelationship = (
  hardware: Entity,
): Relationship =>
  createIntegrationRelationship({
    _key: `location:${hardware.locationId}|has|${hardware._key}`,
    _class: 'HAS',
    _type: DEVICE_LOCATION_RELATIONSHIP,
    _mapping: {
      relationshipDirection: RelationshipDirection.FORWARD,
      sourceEntityKey: `location:${hardware.locationId}`,
      targetFilterKeys: [['_class', 'id', 'locationId']],
      targetEntity: {
        _class: 'Device',
        id: hardware.id,
        locationId: hardware.locationId,
      },
    },
    skipTargetCreation: true,
  });
