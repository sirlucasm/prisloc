"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/model.ts
var model_exports = {};
__export(model_exports, {
  PrislocModel: () => PrislocModel
});
module.exports = __toCommonJS(model_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrislocModel
});
