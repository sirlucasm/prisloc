/* eslint-disable prettier/prettier */
import { SchemaType } from '../types/Schema'
import { extractModelTypesTypeof } from './extractModelTypesTypeof'

export const generateTableTypes = (schema: SchemaType) =>
  schema.models
    .map(
      (model) => `export type ${model.tableName} = {
  ${model.columns.map((column) => {
    if (typeof column.required != 'boolean') column.required = true;
    return `${column.name}${column.required === true ? '' : '?'}: ${extractModelTypesTypeof(column.type)}`
  }).join('\n')}
}\n`,
    )
    .join('\n')
    .replace(',', '')
