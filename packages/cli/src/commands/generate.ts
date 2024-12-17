import { GluegunToolbox } from 'gluegun'
import fs from 'fs/promises'
import { PrislocClient } from 'prisloc'
import { ModelGenerator } from 'prisloc/src/utils/modelGenerator'

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

    const selectedPath = parameters.first
    const currentPath = selectedPath ? `${selectedPath}/prisloc` : 'src/prisloc'

    try {
      const prislocSettingsPathArray = await filesystem.dirAsync('src/prisloc', { empty: false })
      // const prislocSettingsPath = prislocSettingsPathArray.join('/')

      const modelGenerator = new ModelGenerator(currentPath)

      const prislocSettings = prislocSettingsPathArray.read('config.ts')

      // modelGenerator.generateTypes()

      console.log(modelGenerator.generateTypes())

      success(`✅ Models Types generated.`)
    } catch (err: any) {
      console.log(err?.message)
      error('Erro ao inicializar projeto')
      process.exit(1)
    }
  },
}
