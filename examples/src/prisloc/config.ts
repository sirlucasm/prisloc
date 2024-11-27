import { PrislocConfig } from 'prisloc/src/types'

const config: PrislocConfig = {
  dataPath: './data',
  models: [
    {
      name: 'User',
      map: 'usuarios', // Nome personalizado no armazenamento
      fields: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        department: {
          type: 'object',
          relation: {
            model: 'Department',
            reference: 'code',
          },
        },
      },
    },
    {
      name: 'Department',
      fields: {
        code: { type: 'string', required: true },
        name: { type: 'string', required: true },
      },
    },
  ],
}

export default config
