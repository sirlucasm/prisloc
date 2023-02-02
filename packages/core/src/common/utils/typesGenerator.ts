import { SchemaType } from '../types/Schema'
import { extractModelTypesTypeof } from './extractModelTypesTypeof'

export const generateTableTypes = (schema: SchemaType) =>
  schema.models
    .map(
      (model) => `export type ${model.tableName} = {
  ${model.columns.map((column) => `${column.name}: ${extractModelTypesTypeof(column.type)}`)}
}\n`,
    )
    .join('\n')
    .replace(',', '')
