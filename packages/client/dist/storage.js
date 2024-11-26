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

// src/storage.ts
var storage_exports = {};
__export(storage_exports, {
  PrislocStorage: () => PrislocStorage
});
module.exports = __toCommonJS(storage_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrislocStorage
});
