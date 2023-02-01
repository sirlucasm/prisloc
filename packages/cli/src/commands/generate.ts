import { GluegunToolbox } from 'gluegun'
import loading from 'loading-cli'
import { Engine } from '@prisloc/core'

const load = loading({
  color: 'yellow',
})

module.exports = {
  name: 'generate',
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem } = toolbox

    const engine = new Engine()

    load.start('Reading schema...')

    const schemaPath = await filesystem.findAsync({ directories: true, files: true, matching: '.prisloc' })

    load.start('Generating types...')

    engine.generate()

    console.log(schemaPath)

    load.succeed(`Your Prisloc schema was created at ${engine.path}.`)
  },
}
