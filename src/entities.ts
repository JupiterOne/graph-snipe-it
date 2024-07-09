import { SchemaType } from '@jupiterone/integration-sdk-core';
import { createEntityType, createEntityMetadata } from './helpers';

export type HardwareAssignmentType = 'user' | 'asset' | 'location';

export const [AccountEntityMetadata, createAccountAssignEntity] =
  createEntityMetadata({
    resourceName: 'Account',
    _class: ['Account'],
    _type: createEntityType('account'),
    description: 'Snipe-IT Account',
    schema: SchemaType.Object({
      name: SchemaType.String(),
      displayName: SchemaType.String(),
      description: SchemaType.Optional(SchemaType.String()),
    }),
  });

export const [ServiceEntityMetadata, createServiceAssignEntity] =
  createEntityMetadata({
    resourceName: 'Service',
    _class: ['Service'],
    _type: createEntityType('service'),
    description: 'Snipe-IT Service',
    schema: SchemaType.Object({}),
  });

export const [LocationEntityMetadata, createLocationAssignEntity] =
  createEntityMetadata({
    resourceName: 'Location',
    _class: ['Site'],
    _type: createEntityType('location'),
    description: 'Snipe-IT Location',
    schema: SchemaType.Object({
      locationId: SchemaType.Number(),
      image: SchemaType.Optional(SchemaType.String()),
      address: SchemaType.Optional(SchemaType.String()),
      address2: SchemaType.Optional(SchemaType.String()),
      city: SchemaType.String(),
      state: SchemaType.Optional(SchemaType.String()),
      country: SchemaType.String(),
      zip: SchemaType.Optional(SchemaType.String()),
      assignedAssetsCount: SchemaType.Number(),
      assetsCount: SchemaType.Number(),
      rtdAssetsCount: SchemaType.Number(),
      usersCount: SchemaType.Number(),
      currency: SchemaType.Optional(SchemaType.String()),
      isUpdateActionAvailable: SchemaType.Optional(SchemaType.Boolean()),
      isDeleteActionAvailable: SchemaType.Optional(SchemaType.Boolean()),
      isCloneActionAvailable: SchemaType.Optional(SchemaType.Boolean()),
    }),
  });

export const [HardwareEntityMetadata, createHardwareAssignEntity] =
  createEntityMetadata({
    resourceName: 'Hardware',
    _class: ['Device'],
    _type: createEntityType('hardware'),
    description: 'Snipe-IT Hardware',
    schema: SchemaType.Object({
      assignedType: SchemaType.Optional(
        SchemaType.Union([
          SchemaType.Literal('user'),
          SchemaType.Literal('asset'),
          SchemaType.Literal('location'),
        ]),
      ),
      assignedName: SchemaType.Optional(SchemaType.String()),
      company: SchemaType.Optional(
        SchemaType.Union([SchemaType.String(), SchemaType.Null()]),
      ),
      byod: SchemaType.Boolean({
        deprecated: true,
        description: 'Please use BYOD instead.',
      }),
      supplier: SchemaType.Optional(SchemaType.String()),
      EOL: SchemaType.Boolean(),
      locationId: SchemaType.Optional(SchemaType.Number()),
      statusMeta: SchemaType.String(SchemaType.String()),
      statusName: SchemaType.String(SchemaType.String()),
      purchaseCost: SchemaType.Optional(SchemaType.String()),
    }),
  });

export const [ConsumableEntityMetadata, createConsumableAssignEntity] =
  createEntityMetadata({
    resourceName: 'Consumable',
    _class: ['Resource'],
    _type: createEntityType('consumable_resource'),
    description: 'Snipe-IT Consumable',
    schema: SchemaType.Object({
      consumableId: SchemaType.Number(),
      image: SchemaType.Optional(SchemaType.String()),
      'category.id': SchemaType.Optional(
        SchemaType.Number({
          deprecated: true,
          description: 'Please use categoryId instead.',
        }),
      ),
      categoryId: SchemaType.Optional(SchemaType.Number()),
      'category.name': SchemaType.Optional(
        SchemaType.String({
          deprecated: true,
          description: 'Please use categoryName instead.',
        }),
      ),
      categoryName: SchemaType.Optional(SchemaType.String()),
      'company.id': SchemaType.Optional(
        SchemaType.Number({
          deprecated: true,
          description: 'Please use companyId instead.',
        }),
      ),
      companyId: SchemaType.Optional(SchemaType.Number()),
      'company.name': SchemaType.Optional(
        SchemaType.String({
          deprecated: true,
          description: 'Please use companyName instead.',
        }),
      ),
      companyName: SchemaType.Optional(SchemaType.String()),
      itemNo: SchemaType.Optional(SchemaType.String()),
      'location.id': SchemaType.Optional(SchemaType.Number()),
      locationId: SchemaType.Optional(SchemaType.Number()),
      'location.name': SchemaType.Optional(SchemaType.String()),
      locationName: SchemaType.Optional(SchemaType.String()),
      'manufacturer.id': SchemaType.Optional(SchemaType.Number()),
      manufacturerId: SchemaType.Optional(SchemaType.Number()),
      'manufacturer.name': SchemaType.Optional(SchemaType.String()),
      manufacturerName: SchemaType.Optional(SchemaType.String()),
      minAmt: SchemaType.Optional(SchemaType.Number()),
      modelNumber: SchemaType.Optional(SchemaType.String()),
      remaining: SchemaType.Optional(SchemaType.Number()),
      orderNumber: SchemaType.Optional(SchemaType.String()),
      purchaseCost: SchemaType.Optional(SchemaType.String()),
      purchaseDate: SchemaType.Optional(SchemaType.Number()),
      qty: SchemaType.Optional(SchemaType.Number()),
      notes: SchemaType.Optional(SchemaType.Array(SchemaType.String())),
      userCanCheckout: SchemaType.Boolean(),
      'availableActions.checkout': SchemaType.Optional(
        SchemaType.Boolean({
          deprecated: true,
          description: 'Please use availableActionsCheckout instead.',
        }),
      ),
      availableActionsCheckout: SchemaType.Optional(SchemaType.Boolean()),
      'availableActions.checkin': SchemaType.Optional(
        SchemaType.Boolean({
          deprecated: true,
          description: 'Please use availableActionsCheckin instead.',
        }),
      ),
      availableActionsCheckin: SchemaType.Optional(SchemaType.Boolean()),
      'availableActions.update': SchemaType.Optional(
        SchemaType.Boolean({
          deprecated: true,
          description: 'Please use availableActionsUpdate instead.',
        }),
      ),
      availableActionsUpdate: SchemaType.Optional(SchemaType.Boolean()),
      'availableActions.delete': SchemaType.Optional(
        SchemaType.Boolean({
          deprecated: true,
          description: 'Please use availableActionsDelete instead.',
        }),
      ),
      availableActionsDelete: SchemaType.Optional(SchemaType.Boolean()),
    }),
  });

export const [LicenseEntityMetadata, createLicenseAssignEntity] =
  createEntityMetadata({
    resourceName: 'License',
    _class: ['Application'],
    _type: createEntityType('licensed_application'),
    description: 'Snipe-IT License',
    schema: SchemaType.Object({
      licenseId: SchemaType.Optional(SchemaType.Number()),
      company: SchemaType.Optional(SchemaType.String()),
      'manufacturer.id': SchemaType.Optional(SchemaType.Number()),
      manufacturerId: SchemaType.Optional(SchemaType.Number()),
      'manufacturer.name': SchemaType.Optional(SchemaType.String()),
      manufacturerName: SchemaType.Optional(SchemaType.String()),
      productKey: SchemaType.Optional(SchemaType.String()),
      orderNumber: SchemaType.Optional(SchemaType.String()),
      purchaseOrder: SchemaType.Optional(SchemaType.String()),
      purchaseDate: SchemaType.Optional(SchemaType.Number()),
      terminationDate: SchemaType.Optional(SchemaType.Number()),
      depreciation: SchemaType.Optional(SchemaType.String()),
      purchaseCost: SchemaType.Optional(SchemaType.String()),
      notes: SchemaType.Optional(SchemaType.Array(SchemaType.String())),
      expirationDate: SchemaType.Optional(SchemaType.Number()),
      seats: SchemaType.Optional(SchemaType.Number()),
      freeSeatsCount: SchemaType.Optional(SchemaType.Number()),
      licenseName: SchemaType.Optional(SchemaType.String()),
      licenseEmail: SchemaType.Optional(SchemaType.String()),
      reassignable: SchemaType.Optional(SchemaType.Boolean()),
      maintained: SchemaType.Optional(SchemaType.Boolean()),
      'supplier.id': SchemaType.Optional(
        SchemaType.Number({
          deprecated: true,
          description: 'Please use supplierId instead.',
        }),
      ),
      supplierId: SchemaType.Optional(SchemaType.Number()),
      'supplier.name': SchemaType.Optional(
        SchemaType.String({
          deprecated: true,
          description: 'Please use supplierName instead.',
        }),
      ),
      supplierName: SchemaType.Optional(SchemaType.String()),
      'category.id': SchemaType.Optional(
        SchemaType.Number({
          deprecated: true,
          description: 'Please use categoryId instead.',
        }),
      ),
      categoryId: SchemaType.Optional(SchemaType.Number()),
      'category.name': SchemaType.Optional(
        SchemaType.String({
          deprecated: true,
          description: 'Please use categoryName instead.',
        }),
      ),
      categoryName: SchemaType.Optional(SchemaType.String()),
      userCanCheckout: SchemaType.Optional(SchemaType.Boolean()),
      'availableActions.checkout': SchemaType.Optional(
        SchemaType.Boolean({
          deprecated: true,
          description: 'Please use availableActionsCheckout instead.',
        }),
      ),
      availableActionsCheckout: SchemaType.Optional(SchemaType.Boolean()),
      'availableActions.checkin': SchemaType.Optional(
        SchemaType.Boolean({
          deprecated: true,
          description: 'Please use availableActionsCheckin instead.',
        }),
      ),
      availableActionsCheckin: SchemaType.Optional(SchemaType.Boolean()),
      'availableActions.update': SchemaType.Optional(
        SchemaType.Boolean({
          deprecated: true,
          description: 'Please use availableActionsUpdate instead.',
        }),
      ),
      availableActionsUpdate: SchemaType.Optional(SchemaType.Boolean()),
      'availableActions.delete': SchemaType.Optional(
        SchemaType.Boolean({
          deprecated: true,
          description: 'Please use availableActionsDelete instead.',
        }),
      ),
      availableActionsDelete: SchemaType.Optional(SchemaType.Boolean()),
    }),
  });

export const [UserEntityMetadata, createUserAssignEntity] =
  createEntityMetadata({
    resourceName: 'User',
    _class: ['User'],
    _type: createEntityType('user'),
    description: 'Snipe-IT User',
    schema: SchemaType.Object({
      userId: SchemaType.Optional(SchemaType.Number()),
      avatar: SchemaType.Optional(SchemaType.String()),
      remote: SchemaType.Boolean(),
      locale: SchemaType.Optional(SchemaType.String()),
      employeeNum: SchemaType.Optional(SchemaType.String()),
      'manager.id': SchemaType.Optional(
        SchemaType.Number({
          deprecated: true,
          description: 'Please use managerId instead.',
        }),
      ),
      managerId: SchemaType.Optional(SchemaType.Number()),
      'manager.name': SchemaType.Optional(
        SchemaType.String({
          deprecated: true,
          description: 'Please use managerName instead.',
        }),
      ),
      managerName: SchemaType.Optional(SchemaType.String()),
      jobtitle: SchemaType.Optional(SchemaType.String()),
      phone: SchemaType.Optional(SchemaType.String()),
      website: SchemaType.Optional(SchemaType.String()),
      address: SchemaType.Optional(SchemaType.String()),
      city: SchemaType.Optional(SchemaType.String()),
      state: SchemaType.Optional(SchemaType.String()),
      country: SchemaType.Optional(SchemaType.String()),
      zip: SchemaType.Optional(SchemaType.String()),
      email: SchemaType.Optional(
        SchemaType.String({
          format: 'email',
        }),
      ),
      'department.id': SchemaType.Optional(
        SchemaType.Number({
          deprecated: true,
          description: 'Please use departmentId instead.',
        }),
      ),
      departmentId: SchemaType.Optional(SchemaType.Number()),
      'department.name': SchemaType.Optional(
        SchemaType.String({
          deprecated: true,
          description: 'Please use departmentName instead.',
        }),
      ),
      departmentName: SchemaType.Optional(SchemaType.String()),
      'location.id': SchemaType.Optional(
        SchemaType.Number({
          deprecated: true,
          description: 'Please use locationId instead.',
        }),
      ),
      locationId: SchemaType.Optional(SchemaType.Number()),
      'location.name': SchemaType.Optional(
        SchemaType.String({
          deprecated: true,
          description: 'Please use locationName instead.',
        }),
      ),
      locationName: SchemaType.Optional(SchemaType.String()),
      ldapImport: SchemaType.Boolean(),
      twoFactorEnrolled: SchemaType.Boolean(),
      assetsCount: SchemaType.Optional(SchemaType.Number()),
      licensesCount: SchemaType.Optional(SchemaType.Number()),
      accessoriesCount: SchemaType.Optional(SchemaType.Number()),
      consumablesCount: SchemaType.Optional(SchemaType.Number()),
      'company.id': SchemaType.Optional(
        SchemaType.Number({
          deprecated: true,
          description: 'Please use companyId instead.',
        }),
      ),
      companyId: SchemaType.Optional(SchemaType.Number()),
      'company.name': SchemaType.Optional(
        SchemaType.String({
          deprecated: true,
          description: 'Please use companyName instead.',
        }),
      ),
      companyName: SchemaType.Optional(SchemaType.String()),
      'createdBy.id': SchemaType.Optional(SchemaType.Number()),
      createdById: SchemaType.Optional(SchemaType.Number()),
      'createdBy.name': SchemaType.Optional(SchemaType.String()),
      createdByName: SchemaType.Optional(SchemaType.String()),
      lastLogin: SchemaType.Optional(SchemaType.Number()),
      deletedAt: SchemaType.Optional(SchemaType.Number()),
    }),
  });

export const [PersonEntityMetadata, createPersonAssignEntity] =
  createEntityMetadata({
    resourceName: 'Person',
    _class: ['Person'],
    _type: createEntityType('person'),
    description: 'Snipe-IT Person',
    schema: SchemaType.Object({
      name: SchemaType.String(),
    }),
  });
