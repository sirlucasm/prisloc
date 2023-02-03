import { GluegunToolbox } from 'gluegun'
import loading from 'loading-cli'
import { Engine, SchemaType } from '@prisloc/core'
import { ConfigData } from '../types'

const load = loading({
  color: 'yellow',
})

module.exports = {
  name: 'generate',
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem } = toolbox

    const engine = new Engine()

    load.start('Reading schema...')

    const packageJson = JSON.parse((await filesystem.readAsync(filesystem.path('package.json'))) || '{}')

    if (packageJson) {
      const configData: ConfigData = packageJson.prisloc
      if (configData && configData.schema) engine.setPath(configData.schema)
    }

    const schemaReaded = await filesystem.readAsync(filesystem.path(engine.path))

    const schema: SchemaType = JSON.parse(schemaReaded || '{}')

    load.start('Generating types...')

    const typesGenerated = engine.generate(schema)

    const typesPath = filesystem.path(engine.path, '..', 'types.ts')

    await filesystem.fileAsync(typesPath, { content: typesGenerated })

    load.succeed(`Your types are generated at ${engine.path}.`)
  },
}
