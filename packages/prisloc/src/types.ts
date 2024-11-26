export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'object'

export interface FieldRelation {
  model: string
  reference?: string
}

export interface ModelField {
  type: FieldType
  required?: boolean
  unique?: boolean
  relation?: FieldRelation
  map?: string // Nome personalizado para o campo no armazenamento
}

export interface ModelDefinition {
  name: string
  fields: Record<string, ModelField>
  map?: string // Nome personalizado para o modelo no armazenamento
}

export interface PrislocConfig {
  dataPath: string
  models: ModelDefinition[]
}

export type WhereClause = {
  [key: string]: any
}

export type OrderByClause = {
  [key: string]: 'asc' | 'desc'
}
