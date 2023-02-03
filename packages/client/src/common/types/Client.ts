import { SchemaType } from '@prisloc/core'
export interface Client {
  [tableName: string]: {
    findMany(): keyof SchemaType['models']
    create(): keyof SchemaType['models']
  }
}
