export type ModelTypes = 'String' | 'Int' | 'Boolean' | 'DateTime' | 'Object'

export type SchemaType = {
  models: [
    {
      tableName: string
      columns: [
        {
          name: string
          type: ModelTypes
          map?: string
          unique?: boolean
          required?: boolean
          relation?: {
            field: string
            reference: string
            model: object
          }
          default?: unknown
        },
      ]
      map?: string
    },
  ]
}
