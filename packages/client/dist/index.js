import { PrislocModel } from './model';
import { PrislocStorage } from './storage';
export default class Prisloc {
    storage;
    models = new Map();
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
}
export class PrislocClient {
    prisloc;
    constructor(config) {
        this.prisloc = new Prisloc(config);
    }
    // Métodos de conveniência para o cliente
    create(modelName, data) {
        return this.prisloc.getModel(modelName).create(data);
    }
}
