import {
  createIntegrationEntity,
  convertProperties,
  parseTimePropertyValue,
  RelationshipDirection,
  createMappedRelationship,
  MappedRelationship,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { SnipeItUser } from '../../collector';
import { Entities, MappedRelationships } from '../constants';

export function getUserKey(id: string): string {
  return `snipeit_user:${id}`;
}

export function convertUser(
  data: SnipeItUser,
): ReturnType<typeof createIntegrationEntity> {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        ...convertProperties(data),
        _key: getUserKey(data.id),
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        id: getUserKey(data.id),
        userId: data.id,
        displayName: data.name,
        avatar: data.avatar,
        firstName: data.first_name,
        lastName: data.last_name,
        username: data.username,
        remote: data.remote,
        locale: data.locale,
        employeeNum: data.employee_num,
        'manager.id': data.manager?.id,
        'manager.name': data.manager?.name,
        jobtitle: data.jobtitle,
        phone: data.phone,
        website: data.website,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        zip: data.zip,
        email: data.email,
        emailDomain: data.email
          ? [(data.email as string).split('@')[1]]
          : [data.email],
        shortLoginId: data.email
          ? (data.email as string).split('@')[0]
          : data.email,
        'department.id': data.department?.id,
        'department.name': data.department?.name,
        'location.id': data.location?.id,
        'location.name': data.location?.name,
        notes: data.notes ? [data.notes] : undefined,
        'permissions.superuser': data.permission?.superuser,
        'permissions.admin': data.permission?.admin,
        'permissions.import': data.permission?.import,
        'permissions.reports.view': data.permission?.reports.view,
        'permissions.assets.view': data.permission?.assets.view,
        'permissions.assets.create': data.permission?.assets.create,
        'permissions.assets.edit': data.permission?.assets.edit,
        'permissions.assets.delete': data.permission?.assets.delete,
        'permissions.assets.checkin': data.permission?.assets.checkin,
        'permissions.assets.checkout': data.permission?.assets.checkout,
        'permissions.assets.audit': data.permission?.assets.audit,
        'permissions.assets.view.requestable':
          data.permission?.assets.view.requestable,
        'permissions.accessories.view': data.permission?.accessories.view,
        'permissions.accessories.create': data.permission?.accessories.create,
        'permissions.accessories.edit': data.permission?.accessories.edit,
        'permissions.accessories.delete': data.permission?.accessories.delete,
        'permissions.accessories.checkout':
          data.permission?.accessories.checkout,
        'permissions.accessories.checkin': data.permission?.accessories.checkin,
        'permissions.consumables.view': data.permission?.consumables.view,
        'permissions.consumables.create': data.permission?.consumables.create,
        'permissions.consumables.edit': data.permission?.consumables.edit,
        'permissions.consumables.delete': data.permission?.consumables.delete,
        'permissions.consumables.checkout':
          data.permission?.consumables.checkout,
        'permissions.licenses.view': data.permission?.licenses.view,
        'permissions.licenses.create': data.permission?.licenses.create,
        'permissions.licenses.edit': data.permission?.licenses.edit,
        'permissions.licenses.delete': data.permission?.licenses.delete,
        'permissions.licenses.checkout': data.permission?.licenses.checkout,
        'permissions.licenses.keys': data.permission?.licenses.keys,
        'permissions.licenses.files': data.permission?.licenses.files,
        'permissions.components.view': data.permission?.components.view,
        'permissions.components.create': data.permission?.components.create,
        'permissions.components.edit': data.permission?.components.edit,
        'permissions.components.delete': data.permission?.components.delete,
        'permissions.components.checkout': data.permission?.components.checkout,
        'permissions.components.checkin': data.permission?.components.checkin,
        'permissions.kits.view': data.permission?.kits.view,
        'permissions.kits.create': data.permission?.kits.create,
        'permissions.kits.edit': data.permission?.kits.edit,
        'permissions.kits.delete': data.permission?.kits.delete,
        'permissions.users.view': data.permission?.users.view,
        'permissions.users.create': data.permission?.users.create,
        'permissions.users.edit': data.permission?.users.edit,
        'permissions.users.delete': data.permission?.users.delete,
        'permissions.models.view': data.permission?.models.view,
        'permissions.models.create': data.permission?.models.create,
        'permissions.models.edit': data.permission?.models.edit,
        'permissions.models.delete': data.permission?.models.delete,
        'permissions.categories.view': data.permission?.categories.view,
        'permissions.categories.create': data.permission?.categories.create,
        'permissions.categories.edit': data.permission?.categories.edit,
        'permissions.categories.delete': data.permission?.categories.delete,
        'permissions.departments.view': data.permission?.departments.view,
        'permissions.departments.create': data.permission?.departments.create,
        'permissions.departments.edit': data.permission?.departments.edit,
        'permissions.departments.delete': data.permission?.departments.delete,
        'permissions.statuslabels.view': data.permission?.statuslabels.view,
        'permissions.statuslabels.create': data.permission?.statuslabels.create,
        'permissions.statuslabels.edit': data.permission?.statuslabels.edit,
        'permissions.statuslabels.delete': data.permission?.statuslabels.delete,
        'permissions.customfields.view': data.permission?.customfields.view,
        'permissions.customfields.create': data.permission?.customfields.create,
        'permissions.customfields.edit': data.permission?.customfields.edit,
        'permissions.customfields.delete': data.permission?.customfields.delete,
        'permissions.suppliers.view': data.permission?.suppliers.view,
        'permissions.suppliers.create': data.permission?.suppliers.create,
        'permissions.suppliers.edit': data.permission?.suppliers.edit,
        'permissions.suppliers.delete': data.permission?.suppliers.delete,
        'permissions.manufacturers.view': data.permission?.manufacturers.view,
        'permissions.manufacturers.create':
          data.permission?.manufacturers.create,
        'permissions.manufacturers.edit': data.permission?.manufacturers.edit,
        'permissions.manufacturers.delete':
          data.permission?.manufacturers.delete,
        'permissions.depreciations.view': data.permission?.depreciations.view,
        'permissions.depreciations.create':
          data.permission?.depreciations.create,
        'permissions.depreciations.edit': data.permission?.depreciations.edit,
        'permissions.depreciations.delete':
          data.permission?.depreciations.delete,
        'permissions.locations.view': data.permission?.locations.view,
        'permissions.locations.create': data.permission?.locations.create,
        'permissions.locations.edit': data.permission?.locations.edit,
        'permissions.locations.delete': data.permission?.locations.delete,
        'permissions.companies.view': data.permission?.companies.view,
        'permissions.companies.create': data.permission?.companies.create,
        'permissions.companies.edit': data.permission?.companies.edit,
        'permissions.companies.delete': data.permission?.companies.delete,
        'permissions.self.twoFactor': data.permission?.self.two_factor,
        'permissions.self.api': data.permission?.self.api,
        'permissions.self.editLocation': data.permission?.self.edit_location,
        'permissions.self.checkoutAssets':
          data.permission?.self.checkout_assets,
        active: data.activated,
        ldapImport: data.ldap_import,
        mfaEnabled: data.two_factor_activated,
        twoFactorEnrolled: data.two_factor_enrolled,
        assetsCount: data.assets_count,
        licensesCount: data.licenses_count,
        accessoriesCount: data.accessories_count,
        consumablesCount: data.consumables_count,
        'company.id': data.company?.id,
        'company.name': data.company?.name,
        'createdBy.id': data.created_by?.id,
        'createdBy.name': data.created_by?.name,
        createdOn: parseTimePropertyValue(data.created_at?.datetime),
        updatedOn: parseTimePropertyValue(data.updated_at?.datetime),
        lastLogin: parseTimePropertyValue(data.last_login?.datetime),
        deletedAt: parseTimePropertyValue(data.deleted_at?.datetime),
      },
    },
  });
}

export function createUserPersonMappedRelationship(
  user: Entity,
): MappedRelationship {
  return createMappedRelationship({
    _key: `${user._key}|is|${user.username}`,
    _class: MappedRelationships.USER_IS_PERSON._class,
    _type: MappedRelationships.USER_IS_PERSON._type,
    _mapping: {
      relationshipDirection: RelationshipDirection.FORWARD,
      sourceEntityKey: user._key,
      targetFilterKeys: [['_class', 'username', 'email']],
      targetEntity: {
        _class: Entities.PERSON._class,
        id: user.id,
        userId: user.userId as number,
        username: user.username as number,
        email: user.userId as number,
      },
      skipTargetCreation: true,
    },
  });
}
