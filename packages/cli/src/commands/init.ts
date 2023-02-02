import { GluegunToolbox } from 'gluegun'
import loading from 'loading-cli'
import { Engine } from '@prisloc/core'
import { ConfigData } from '../types'

const load = loading({
  color: 'yellow',
})

module.exports = {
  name: 'init',
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem } = toolbox

    const engine = new Engine()

    const packageJson = JSON.parse((await filesystem.readAsync(filesystem.path('package.json'))) || '{}')

    if (packageJson) {
      const configData: ConfigData = packageJson.prisloc
      if (configData && configData.schema) engine.setPath(configData.schema)
    }

    const schema: string = (await filesystem.readAsync(filesystem.path(engine.path))) || ''

    if (schema) {
      load.succeed(`Prisloc schema already exists.`)
      return
    }

    load.start('Creating your schema...')

    const newSchema = engine.start()

    await filesystem.fileAsync(engine.path, { content: newSchema })

    load.succeed(`Your Prisloc schema was created at ${engine.path}.`)
  },
}
