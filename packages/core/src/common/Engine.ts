import { SchemaType } from './types/Schema'
import { generateFirstSchema } from './utils/schemaGenerator'
import { generateTableTypes } from './utils/typesGenerator'
import fs from 'fs/promises'

export class Engine {
  private corePath = '../../packages/core/'
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

  async generate(schema: SchemaType) {
    try {
      const data = await fs.readFile(`${this.corePath}src/common/types/Schema.ts`)
      console.log(data)
      return generateTableTypes(schema)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
