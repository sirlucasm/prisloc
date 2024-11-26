import { PrislocModel } from './model'
import { PrislocStorage } from './storage'
import { PrislocConfig } from './types'

export default class Prisloc {
  private storage: PrislocStorage
  private models: Map<string, PrislocModel> = new Map()
  private config: PrislocConfig

  constructor(config: PrislocConfig) {
    this.config = config
    this.storage = new PrislocStorage(config)
    this.createModels()
  }

  private createModels(): void {
    for (const modelDef of this.config.models) {
      const model = new PrislocModel(modelDef, this.storage)
      this.models.set(modelDef.name, model)
    }
  }

  getModel(name: string): PrislocModel {
    const model = this.models.get(name)
    if (!model) throw new Error(`Model ${name} not found`)
    return model
  }
}

export class PrislocClient {
  private prisloc: Prisloc

  constructor(config: PrislocConfig) {
    this.prisloc = new Prisloc(config)
  }

  // Métodos de conveniência para o cliente
  create(modelName: string, data: Record<string, any>) {
    return this.prisloc.getModel(modelName).create(data)
  }

  // Outros métodos similares: findMany, update, delete
}
