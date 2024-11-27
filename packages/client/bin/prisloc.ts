#!/usr/bin/env node

import * as fs from 'fs/promises'
import * as path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const INITIAL_CONFIG_TEMPLATE = `
import { PrislocConfig } from 'prisloc';

const config: PrislocConfig = {
  dataPath: './data',
  models: [
    {
      name: 'User',
      fields: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        email: { 
          type: 'string', 
          required: true, 
          unique: true 
        }
      }
    }
  ]
};

export default config;
`

const INITIAL_MODEL_TEMPLATE = `
import { ModelDefinition } from 'prisloc';

export const modelName: ModelDefinition = {
  name: 'ModelName',
  fields: {
    id: { type: 'string', required: true },
    // Adicione seus campos aqui
  }
};
`

async function initializeProject() {
  try {
    await fs.mkdir('./prisloc', { recursive: true })
    await fs.writeFile('./prisloc/config.ts', INITIAL_CONFIG_TEMPLATE)
    console.log('✅ Prisloc config inicializado em ./prisloc/config.ts')
  } catch (error) {
    console.error('Erro ao inicializar projeto:', error)
  }
}

async function generateModel(name: string) {
  const fileName = `${name}.model.ts`
  const filePath = path.join('./prisloc', fileName)

  try {
    const modelTemplate = INITIAL_MODEL_TEMPLATE.replace(/ModelName/g, name)
    await fs.writeFile(filePath, modelTemplate)
    console.log(`✅ Modelo ${name} gerado em ${filePath}`)
  } catch (error) {
    console.error('Erro ao gerar modelo:', error)
  }
}

yargs(hideBin(process.argv))
  .command('init', 'Inicializa um novo projeto Prisloc', {}, initializeProject)
  .command(
    'generate <type> <name>',
    'Gera um novo modelo ou configuração',
    yargs => {
      yargs
        .positional('type', {
          describe: 'Tipo de geração (model, config)',
          choices: ['model', 'config'],
        })
        .positional('name', {
          describe: 'Nome do modelo ou configuração',
        })
    },
    argv => {
      if (argv.type === 'model' && argv.name) {
        generateModel(argv.name as string)
      } else if (argv.type === 'config') {
        initializeProject()
      }
    }
  )
  .demandCommand(1, 'Você precisa informar um comando')
  .help('h')
  .alias('h', 'help')
  .parse()
