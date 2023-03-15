import {
  createIntegrationEntity,
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
  const [shortLoginId, emailDomain] = data.email
    ? data.email.split('@')
    : [undefined, undefined];

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: getUserKey(String(data.id)),
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        id: getUserKey(String(data.id)),
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
        ...(data.email && { email: data.email }),
        ...(emailDomain && { emailDomain: [emailDomain] }),
        ...(shortLoginId && { shortLoginId }),
        'department.id': data.department?.id,
        'department.name': data.department?.name,
        'location.id': data.location?.id,
        'location.name': data.location?.name,
        notes: data.notes ? [data.notes] : undefined,
        ...(data.permissions && {
          'permissions.superuser': data.permissions.superuser,
          'permissions.admin': data.permissions.admin,
          'permissions.import': data.permissions.import,
          'permissions.reports.view': data.permissions['reports.view'],
          'permissions.assets.view': data.permissions['assets.view'],
          'permissions.assets.create': data.permissions['assets.create'],
          'permissions.assets.edit': data.permissions['assets.edit'],
          'permissions.assets.delete': data.permissions['assets.delete'],
          'permissions.assets.checkin': data.permissions['assets.checkin'],
          'permissions.assets.checkout': data.permissions['assets.checkout'],
          'permissions.assets.audit': data.permissions['assets.audit'],
          'permissions.assets.view.requestable':
            data.permissions['assets.view.requestable'],
          'permissions.accessories.view': data.permissions['accessories.view'],
          'permissions.accessories.create':
            data.permissions['accessories.create'],
          'permissions.accessories.edit': data.permissions['accessories.edit'],
          'permissions.accessories.delete':
            data.permissions['accessories.delete'],
          'permissions.accessories.checkout':
            data.permissions['accessories.checkout'],
          'permissions.accessories.checkin':
            data.permissions['accessories.checkin'],
          'permissions.consumables.view': data.permissions['consumables.view'],
          'permissions.consumables.create':
            data.permissions['consumables.create'],
          'permissions.consumables.edit': data.permissions['consumables.edit'],
          'permissions.consumables.delete':
            data.permissions['consumables.delete'],
          'permissions.consumables.checkout':
            data.permissions['consumables.checkout'],
          'permissions.licenses.view': data.permissions['licenses.view'],
          'permissions.licenses.create': data.permissions['licenses.create'],
          'permissions.licenses.edit': data.permissions['licenses.edit'],
          'permissions.licenses.delete': data.permissions['licenses.delete'],
          'permissions.licenses.checkout':
            data.permissions['licenses.checkout'],
          'permissions.licenses.keys': data.permissions['licenses.keys'],
          'permissions.licenses.files': data.permissions['licenses.files'],
          'permissions.components.view': data.permissions['components.view'],
          'permissions.components.create':
            data.permissions['components.create'],
          'permissions.components.edit': data.permissions['components.edit'],
          'permissions.components.delete':
            data.permissions['components.delete'],
          'permissions.components.checkout':
            data.permissions['components.checkout'],
          'permissions.components.checkin':
            data.permissions['components.checkin'],
          'permissions.kits.view': data.permissions['kits.view'],
          'permissions.kits.create': data.permissions['kits.create'],
          'permissions.kits.edit': data.permissions['kits.edit'],
          'permissions.kits.delete': data.permissions['kits.delete'],
          'permissions.users.view': data.permissions['users.view'],
          'permissions.users.create': data.permissions['users.create'],
          'permissions.users.edit': data.permissions['users.edit'],
          'permissions.users.delete': data.permissions['users.delete'],
          'permissions.models.view': data.permissions['models.view'],
          'permissions.models.create': data.permissions['models.create'],
          'permissions.models.edit': data.permissions['models.edit'],
          'permissions.models.delete': data.permissions['models.delete'],
          'permissions.categories.view': data.permissions['categories.view'],
          'permissions.categories.create':
            data.permissions['categories.create'],
          'permissions.categories.edit': data.permissions['categories.edit'],
          'permissions.categories.delete':
            data.permissions['categories.delete'],
          'permissions.departments.view': data.permissions['departments.view'],
          'permissions.departments.create':
            data.permissions['departments.create'],
          'permissions.departments.edit': data.permissions['departments.edit'],
          'permissions.departments.delete':
            data.permissions['departments.delete'],
          'permissions.statuslabels.view':
            data.permissions['statuslabels.view'],
          'permissions.statuslabels.create':
            data.permissions['statuslabels.create'],
          'permissions.statuslabels.edit':
            data.permissions['statuslabels.edit'],
          'permissions.statuslabels.delete':
            data.permissions['statuslabels.delete'],
          'permissions.customfields.view':
            data.permissions['customfields.view'],
          'permissions.customfields.create':
            data.permissions['customfields.create'],
          'permissions.customfields.edit':
            data.permissions['customfields.edit'],
          'permissions.customfields.delete':
            data.permissions['customfields.delete'],
          'permissions.suppliers.view': data.permissions['suppliers.view'],
          'permissions.suppliers.create': data.permissions['suppliers.create'],
          'permissions.suppliers.edit': data.permissions['suppliers.edit'],
          'permissions.suppliers.delete': data.permissions['suppliers.delete'],
          'permissions.manufacturers.view':
            data.permissions['manufacturers.view'],
          'permissions.manufacturers.create':
            data.permissions['manufacturers.create'],
          'permissions.manufacturers.edit':
            data.permissions['manufacturers.edit'],
          'permissions.manufacturers.delete':
            data.permissions['manufacturers.delete'],
          'permissions.depreciations.view':
            data.permissions['depreciations.view'],
          'permissions.depreciations.create':
            data.permissions['depreciations.create'],
          'permissions.depreciations.edit':
            data.permissions['depreciations.edit'],
          'permissions.depreciations.delete':
            data.permissions['depreciations.delete'],
          'permissions.locations.view': data.permissions['locations.view'],
          'permissions.locations.create': data.permissions['locations.create'],
          'permissions.locations.edit': data.permissions['locations.edit'],
          'permissions.locations.delete': data.permissions['locations.delete'],
          'permissions.companies.view': data.permissions['companies.view'],
          'permissions.companies.create': data.permissions['companies.create'],
          'permissions.companies.edit': data.permissions['companies.edit'],
          'permissions.companies.delete': data.permissions['companies.delete'],
          'permissions.self.twoFactor': data.permissions['self.two_factor'],
          'permissions.self.api': data.permissions['self.api'],
          'permissions.self.editLocation':
            data.permissions['self.edit_location'],
          'permissions.self.checkoutAssets':
            data.permissions['self.checkout_assets'],
        }),
        active: data.activated,
        ldapImport: data.ldap_import,
        mfaEnabled: Boolean(data.two_factor_activated),
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
