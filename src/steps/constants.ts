import {
  RelationshipClass,
  RelationshipDirection,
  StepEntityMetadata,
  StepMappedRelationshipMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';
import {
  AccountEntityMetadata,
  ConsumableEntityMetadata,
  HardwareEntityMetadata,
  LicenseEntityMetadata,
  LocationEntityMetadata,
  PersonEntityMetadata,
  ServiceEntityMetadata,
  UserEntityMetadata,
} from '../entities';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

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
  ACCOUNT: AccountEntityMetadata,
  SERVICE: ServiceEntityMetadata,
  LOCATION: LocationEntityMetadata,
  HARDWARE: HardwareEntityMetadata,
  CONSUMABLE: ConsumableEntityMetadata,
  LICENSE: LicenseEntityMetadata,
  USER: UserEntityMetadata,
  PERSON: PersonEntityMetadata,
};

export const Relationships: Record<
  | 'ACCOUNT_PROVIDES_SERVICE'
  | 'ACCOUNT_MANAGES_LOCATION'
  | 'ACCOUNT_HAS_CONSUMABLE'
  | 'ACCOUNT_HAS_LICENSE'
  | 'ACCOUNT_HAS_USER'
  | 'USER_USES_CONSUMABLE'
  | 'HARDWARE_INSTALLED_LICENSE'
  | 'USER_HAS_HARDWARE'
  | 'ACCOUNT_MANAGES_HARDWARE',
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
  HARDWARE_INSTALLED_LICENSE: {
    _type: 'snipeit_hardware_installed_licensed_application',
    sourceType: Entities.HARDWARE._type,
    _class: RelationshipClass.INSTALLED,
    targetType: Entities.LICENSE._type,
  },
  USER_HAS_HARDWARE: {
    _type: 'snipeit_user_has_hardware',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.HARDWARE._type,
  },
  ACCOUNT_MANAGES_HARDWARE: {
    _type: 'snipeit_account_manages_hardware',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.MANAGES,
    targetType: Entities.HARDWARE._type,
  },
};

export const MappedRelationships: Record<
  'LOCATION_HAS_HARDWARE' | 'USER_IS_PERSON',
  StepMappedRelationshipMetadata
> = {
  LOCATION_HAS_HARDWARE: {
    _type: 'site_has_hardware',
    sourceType: Entities.LOCATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.HARDWARE._type,
    direction: RelationshipDirection.FORWARD,
  },
  USER_IS_PERSON: {
    _type: 'snipeit_user_is_person',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.IS,
    targetType: Entities.PERSON._type,
    direction: RelationshipDirection.FORWARD,
  },
};
