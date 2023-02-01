import { generateFirstSchema } from './utils/schemaGenerator'

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

  generate() {
    console.log(this.cwd)
  }
}
