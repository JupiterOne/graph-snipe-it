import {
  RelationshipClass,
  RelationshipDirection,
  StepEntityMetadata,
  StepMappedRelationshipMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const ACCOUNT_ENTITY_KEY = 'entity:account';
export const HARDWARE_IDS = 'HARDWARE_IDS';

export const Steps = {
  ACCOUNT: 'fetch-account',
  HARDWARE: 'fetch-hardware',
  USERS: 'fetch-users',
  CONSUMABLES: 'fetch-consumables',
  BUILD_USER_CONSUMABLES_RELATIONSHIPS:
    'build-user-and-consumable-relationships',
  LICENSES: 'fetch-licenses',
};

export const Entities: Record<
  | 'ACCOUNT'
  | 'SERVICE'
  | 'HARDWARE'
  | 'LOCATION'
  | 'CONSUMABLE'
  | 'LICENSE'
  | 'USER'
  | 'PERSON',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'snipeit_account',
    _class: ['Account'],
  },
  SERVICE: {
    resourceName: 'Service',
    _type: 'snipeit_service',
    _class: ['Service'],
  },
  LOCATION: {
    resourceName: 'Location',
    _type: 'location',
    _class: ['Site'],
  },
  HARDWARE: {
    resourceName: 'Hardware',
    _type: 'hardware',
    _class: ['Device'],
  },
  CONSUMABLE: {
    resourceName: 'Consumable',
    _type: 'snipeit_consumable_resource',
    _class: ['Resource'],
  },
  LICENSE: {
    resourceName: 'License',
    _type: 'snipeit_licensed_application',
    _class: ['Application'],
  },
  USER: {
    resourceName: 'User',
    _type: 'snipeit_user',
    _class: ['User'],
  },
  PERSON: {
    resourceName: 'Person',
    _type: 'person',
    _class: ['Person'],
  },
};

export const Relationships: Record<
  | 'ACCOUNT_PROVIDES_SERVICE'
  | 'ACCOUNT_MANAGES_LOCATION'
  | 'ACCOUNT_HAS_CONSUMABLE'
  | 'ACCOUNT_HAS_LICENSE'
  | 'ACCOUNT_HAS_USER'
  | 'USER_USES_CONSUMABLE',
  StepRelationshipMetadata
> = {
  ACCOUNT_PROVIDES_SERVICE: {
    _type: 'snipeit_account_provides_service',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.PROVIDES,
    targetType: Entities.SERVICE._type,
  },
  ACCOUNT_MANAGES_LOCATION: {
    _type: 'snipeit_account_manages_location',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.MANAGES,
    targetType: Entities.LOCATION._type,
  },
  ACCOUNT_HAS_CONSUMABLE: {
    _type: 'snipeit_account_has_consumable_resource',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.CONSUMABLE._type,
  },
  ACCOUNT_HAS_LICENSE: {
    _type: 'snipeit_account_has_licensed_application',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.LICENSE._type,
  },
  ACCOUNT_HAS_USER: {
    _type: 'snipeit_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  USER_USES_CONSUMABLE: {
    _type: 'snipeit_user_uses_consumable_resource',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.USES,
    targetType: Entities.CONSUMABLE._type,
  },
};

export const MappedRelationships: Record<
  | 'ACCOUNT_MANAGES_HARDWARE'
  | 'LOCATION_HAS_HARDWARE'
  | 'LICENSE_INSTALLED_HARDWARE'
  | 'USER_IS_PERSON',
  StepMappedRelationshipMetadata
> = {
  ACCOUNT_MANAGES_HARDWARE: {
    _type: 'snipeit_account_manages_hardware',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.MANAGES,
    targetType: Entities.HARDWARE._type,
    direction: RelationshipDirection.FORWARD,
  },
  LOCATION_HAS_HARDWARE: {
    _type: 'site_has_hardware',
    sourceType: Entities.LOCATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.HARDWARE._type,
    direction: RelationshipDirection.FORWARD,
  },
  LICENSE_INSTALLED_HARDWARE: {
    _type: 'snipeit_licensed_application_installed_hardware',
    sourceType: Entities.LICENSE._type,
    _class: RelationshipClass.INSTALLED,
    targetType: Entities.HARDWARE._type,
    direction: RelationshipDirection.REVERSE,
  },
  USER_IS_PERSON: {
    _type: 'snipeit_user_is_person',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.IS,
    targetType: Entities.PERSON._type,
    direction: RelationshipDirection.FORWARD,
  },
};
