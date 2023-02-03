import { SchemaType } from '../types/Schema'

export const generateFirstSchema = (): SchemaType => ({
  models: [
    {
      tableName: 'user',
      columns: [
        {
          name: 'name',
          type: 'String',
          default: 'teste',
          required: false,
        },
      ],
      map: 'users',
    },
  ],
})
