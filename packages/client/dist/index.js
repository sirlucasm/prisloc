"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Prisloc: () => Prisloc,
  PrislocClient: () => PrislocClient
});
module.exports = __toCommonJS(src_exports);

// src/model.ts
var import_uuid = require("uuid");
var PrislocModel = class {
  static {
    __name(this, "PrislocModel");
  }
  definition;
  storage;
  constructor(definition, storage) {
    this.definition = definition;
    this.storage = storage;
  }
  async validateData(data) {
    for (const [fieldName, fieldConfig] of Object.entries(this.definition.fields)) {
      const value = data[fieldName];
      if (fieldConfig.required && value === void 0) {
        throw new Error(`Field ${fieldName} is required`);
      }
      if (value !== void 0) {
        switch (fieldConfig.type) {
          case "string":
            if (typeof value !== "string")
              throw new Error(`Field ${fieldName} must be a string`);
            break;
          case "number":
            if (typeof value !== "number")
              throw new Error(`Field ${fieldName} must be a number`);
            break;
          case "boolean":
            if (typeof value !== "boolean")
              throw new Error(`Field ${fieldName} must be a boolean`);
            break;
          case "date":
            if (!(value instanceof Date))
              throw new Error(`Field ${fieldName} must be a Date`);
            break;
          case "object":
            if (typeof value !== "object")
              throw new Error(`Field ${fieldName} must be a object`);
            break;
        }
        if (fieldConfig.relation) {
          await this.storage.resolveRelation(fieldConfig, value);
        }
      }
    }
  }
  async checkUnique(field, value, excludeId) {
    const allData = await this.storage.readData(this.definition.name);
    const exists = allData.some((item) => item[field] === value && item.id !== excludeId);
    if (exists) {
      throw new Error(`Value ${value} for field ${field} already exists`);
    }
  }
  async create(data) {
    await this.validateData(data);
    const newItem = {
      id: (0, import_uuid.v4)(),
      ...data,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    const items = await this.storage.readData(this.definition.name);
    items.push(newItem);
    await this.storage.writeData(this.definition.name, items);
    return newItem;
  }
  async findMany(options) {
    let data = await this.storage.readData(this.definition.name);
    if (options?.where) {
      const whereEntries = Object.entries(options.where);
      data = data.filter((item) => whereEntries.every(([key, value]) => value === null ? item[key] === null : item[key] === value));
    }
    if (options?.orderBy) {
      const [field, order] = Object.entries(options.orderBy)[0];
      data.sort((a, b) => {
        if (order === "asc") {
          return a[field] > b[field] ? 1 : -1;
        } else {
          return a[field] < b[field] ? 1 : -1;
        }
      });
    }
    if (options?.skip) {
      data = data.slice(options.skip);
    }
    if (options?.take) {
      data = data.slice(0, options.take);
    }
    return data;
  }
  async findUnique(where) {
    const results = await this.findMany({
      where
    });
    return results[0] || null;
  }
  async update(where, data) {
    const allData = await this.storage.readData(this.definition.name);
    const index = allData.findIndex((item) => Object.entries(where).every(([key, value]) => item[key] === value));
    if (index === -1) {
      throw new Error("Record not found");
    }
    this.validateData({
      ...allData[index],
      ...data
    });
    for (const [field, config] of Object.entries(this.definition.fields)) {
      if (config.unique && data[field] !== void 0) {
        await this.checkUnique(field, data[field], allData[index].id);
      }
    }
    const updatedItem = {
      ...allData[index],
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    };
    allData[index] = updatedItem;
    await this.storage.writeData(this.definition.name, allData);
    return updatedItem;
  }
  async delete(where) {
    const allData = await this.storage.readData(this.definition.name);
    const index = allData.findIndex((item) => Object.entries(where).every(([key, value]) => item[key] === value));
    if (index === -1) {
      throw new Error("Record not found");
    }
    const deletedItem = allData[index];
    allData.splice(index, 1);
    await this.storage.writeData(this.definition.name, allData);
    return deletedItem;
  }
};

// src/storage.ts
var import_promises = __toESM(require("fs/promises"));
var import_path = __toESM(require("path"));
var PrislocStorage = class {
  static {
    __name(this, "PrislocStorage");
  }
  config;
  constructor(config) {
    this.config = config;
  }
  getModelFilePath(modelName) {
    const mappedName = this.getModelMappedName(modelName);
    return import_path.default.join(this.config.dataPath, `${mappedName}.json`);
  }
  getModelMappedName(modelName) {
    const model = this.config.models.find((m) => m.name === modelName);
    return model?.map || modelName.toLowerCase();
  }
  async readData(modelName) {
    const filePath = this.getModelFilePath(modelName);
    try {
      const data = await import_promises.default.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }
  async writeData(modelName, data) {
    const filePath = this.getModelFilePath(modelName);
    await import_promises.default.writeFile(filePath, JSON.stringify(data, null, 2));
  }
  async resolveRelation(field, value) {
    if (!field.relation)
      return value;
    const relatedModel = this.config.models.find((m) => m.name === field.relation?.model);
    if (!relatedModel) {
      throw new Error(`Related model ${field.relation.model} not found`);
    }
    const data = await this.readData(field.relation.model);
    const referenceField = field.relation.reference || "id";
    return data.find((item) => item[referenceField] === value);
  }
};

// src/index.ts
var Prisloc = class {
  static {
    __name(this, "Prisloc");
  }
  storage;
  models = /* @__PURE__ */ new Map();
  config;
  constructor(config) {
    this.config = config;
    this.storage = new PrislocStorage(config);
    this.createModels();
  }
  createModels() {
    for (const modelDef of this.config.models) {
      const model = new PrislocModel(modelDef, this.storage);
      this.models.set(modelDef.name, model);
    }
  }
  getModel(name) {
    const model = this.models.get(name);
    if (!model)
      throw new Error(`Model ${name} not found`);
    return model;
  }
};
var PrislocClient = class {
  static {
    __name(this, "PrislocClient");
  }
  prisloc;
  constructor(config) {
    this.prisloc = new Prisloc(config);
  }
  // Métodos de conveniência para o cliente
  create(modelName, data) {
    return this.prisloc.getModel(modelName).create(data);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Prisloc,
  PrislocClient
});
