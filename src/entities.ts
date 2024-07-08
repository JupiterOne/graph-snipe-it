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
    }),
  });
