interface SchemaType {
  models: [
    {
      [key: string]: {
        columns: [
          {
            name: string
            type: ModelTypes
            map?: string
            unique?: boolean
            relation?: {
              field: string
              reference: string
              model: object
            }
            default?: unknown
          },
        ]
        map?: string
      }
    },
  ]
}

declare module '*.prisloc.json' {
  const value: SchemaType
  export default value
}
