import fs from 'fs/promises';
import path from 'path';
export class PrislocStorage {
    config;
    constructor(config) {
        this.config = config;
    }
    getModelFilePath(modelName) {
        const mappedName = this.getModelMappedName(modelName);
        return path.join(this.config.dataPath, `${mappedName}.json`);
    }
    getModelMappedName(modelName) {
        const model = this.config.models.find(m => m.name === modelName);
        return model?.map || modelName.toLowerCase();
    }
    async readData(modelName) {
        const filePath = this.getModelFilePath(modelName);
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            return [];
        }
    }
    async writeData(modelName, data) {
        const filePath = this.getModelFilePath(modelName);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }
    async resolveRelation(field, value) {
        if (!field.relation)
            return value;
        const relatedModel = this.config.models.find(m => m.name === field.relation?.model);
        if (!relatedModel) {
            throw new Error(`Related model ${field.relation.model} not found`);
        }
        const data = await this.readData(field.relation.model);
        const referenceField = field.relation.reference || 'id';
        return data.find(item => item[referenceField] === value);
    }
}
