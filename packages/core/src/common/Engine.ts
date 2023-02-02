import { SchemaType } from './types/Schema'
import { generateFirstSchema } from './utils/schemaGenerator'
import { generateTableTypes } from './utils/typesGenerator'

export class Engine {
  cwd = ''
  path = 'prisloc/schema.prisloc'

  constructor() {
    this.cwd = process.cwd()
  }

  start() {
    return generateFirstSchema()
  }

  setPath(path: string) {
    this.path = path
  }

  generate(schema: SchemaType) {
    return generateTableTypes(schema)
  }
}
