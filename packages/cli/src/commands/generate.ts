import { GluegunToolbox } from 'gluegun'
import fs from 'fs/promises'
import { PrislocClient } from 'prisloc'
import { ModelGenerator } from 'prisloc/dist/utils/modelGenerator'

module.exports = {
  name: 'generate',
  alias: ['g'],
  description: 'Generate your models types',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      template: { generate },
      print: { success, error },
      filesystem,
    } = toolbox

    try {
      const prislocSettingsPathArray = await filesystem.findAsync('prisloc', { directories: true })
      const prislocSettingsPath = prislocSettingsPathArray.join('/')

      const modelGenerator = new ModelGenerator(prislocSettingsPath)

      const prislocSettings = require(`${prislocSettingsPath}/config.ts`)

      // modelGenerator.generateTypes()

      console.log(prislocSettings)

      success(`✅ Models Types generated.`)
    } catch (err) {
      error('Erro ao inicializar projeto')
      process.exit(1)
    }
  },
}
