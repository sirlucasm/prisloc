import { GluegunToolbox } from 'gluegun'
import fs from 'fs/promises'
import path from 'path'

module.exports = {
  name: 'init',
  alias: ['i'],
  description: 'Create prisloc folder and initial configs',
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      template: { generate },
      print: { success, error },
    } = toolbox

    try {
      const userSelectedPath = parameters.first

      const pathToGenerateFile = path.join(userSelectedPath ?? 'src/', 'prisloc/config.ts')

      generate({
        template: 'config.js.ejs',
        target: pathToGenerateFile,
      })

      success(`✅ Prisloc config inicializado em ${pathToGenerateFile}`)
    } catch (err) {
      error('Erro ao inicializar projeto')
      process.exit(1)
    }
  },
}
