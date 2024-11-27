import { v4 as uuidv4 } from 'uuid'
import { ModelDefinition, OrderByClause, WhereClause } from '../types'
import { PrislocStorage } from './storage'

export class PrislocModel {
  private definition: ModelDefinition
  private storage: PrislocStorage

  constructor(definition: ModelDefinition, storage: PrislocStorage) {
    this.definition = definition
    this.storage = storage
  }

  private async validateData(data: Record<string, any>): Promise<void> {
    for (const [fieldName, fieldConfig] of Object.entries(this.definition.fields)) {
      const value = data[fieldName]

      // Verificação de campos obrigatórios
      if (fieldConfig.required && value === undefined) {
        throw new Error(`Field ${fieldName} is required`)
      }

      // Validação de tipos
      if (value !== undefined) {
        switch (fieldConfig.type) {
          case 'string':
            if (typeof value !== 'string') throw new Error(`Field ${fieldName} must be a string`)
            break
          case 'number':
            if (typeof value !== 'number') throw new Error(`Field ${fieldName} must be a number`)
            break
          case 'boolean':
            if (typeof value !== 'boolean') throw new Error(`Field ${fieldName} must be a boolean`)
            break
          case 'date':
            if (!(value instanceof Date)) throw new Error(`Field ${fieldName} must be a Date`)
            break
          case 'object':
            if (typeof value !== 'object') throw new Error(`Field ${fieldName} must be a object`)
            break
        }

        // Validação de relações
        if (fieldConfig.relation) {
          await this.storage.resolveRelation(fieldConfig, value)
        }
      }
    }
  }

  private async checkUnique(field: string, value: any, excludeId?: string): Promise<void> {
    const allData = await this.storage.readData(this.definition.name)
    const exists = allData.some(item => item[field] === value && item.id !== excludeId)
    if (exists) {
      throw new Error(`Value ${value} for field ${field} already exists`)
    }
  }

  async create(data: Record<string, any>): Promise<any> {
    await this.validateData(data)

    const newItem = {
      id: uuidv4(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const items = await this.storage.readData(this.definition.name)
    items.push(newItem)
    await this.storage.writeData(this.definition.name, items)

    return newItem
  }

  async findMany(options?: {
    where?: WhereClause
    orderBy?: OrderByClause
    skip?: number
    take?: number
  }): Promise<any[]> {
    let data = await this.storage.readData(this.definition.name)

    if (options?.where) {
      const whereEntries = Object.entries(options.where)
      data = data.filter(item =>
        whereEntries.every(([key, value]) => (value === null ? item[key] === null : item[key] === value))
      )
    }

    if (options?.orderBy) {
      const [field, order] = Object.entries(options.orderBy)[0]
      data.sort((a, b) => {
        if (order === 'asc') {
          return a[field] > b[field] ? 1 : -1
        } else {
          return a[field] < b[field] ? 1 : -1
        }
      })
    }

    if (options?.skip) {
      data = data.slice(options.skip)
    }

    if (options?.take) {
      data = data.slice(0, options.take)
    }

    return data
  }

  async findUnique(where: WhereClause): Promise<any | null> {
    const results = await this.findMany({ where })
    return results[0] || null
  }

  async update(where: WhereClause, data: any): Promise<any> {
    const allData = await this.storage.readData(this.definition.name)
    const index = allData.findIndex(item => Object.entries(where).every(([key, value]) => item[key] === value))

    if (index === -1) {
      throw new Error('Record not found')
    }

    this.validateData({ ...allData[index], ...data })

    // Check unique constraints
    for (const [field, config] of Object.entries(this.definition.fields)) {
      if (config.unique && data[field] !== undefined) {
        await this.checkUnique(field, data[field], allData[index].id)
      }
    }

    const updatedItem = {
      ...allData[index],
      ...data,
      updatedAt: new Date(),
    }

    allData[index] = updatedItem
    await this.storage.writeData(this.definition.name, allData)

    return updatedItem
  }

  async delete(where: WhereClause): Promise<any> {
    const allData = await this.storage.readData(this.definition.name)
    const index = allData.findIndex(item => Object.entries(where).every(([key, value]) => item[key] === value))

    if (index === -1) {
      throw new Error('Record not found')
    }

    const deletedItem = allData[index]
    allData.splice(index, 1)
    await this.storage.writeData(this.definition.name, allData)

    return deletedItem
  }
}
