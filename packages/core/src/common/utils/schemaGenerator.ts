import { SchemaType } from '../types/Schema'

export const generateFirstSchema = (): SchemaType => ({
  models: [
    {
      user: {
        columns: [
          {
            name: 'name',
            type: 'String',
            default: 'teste',
          },
        ],
        map: 'users',
      },
    },
  ],
})
