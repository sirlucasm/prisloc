import { GluegunToolbox } from 'gluegun'
import loading from 'loading-cli'

const load = loading({
  color: 'yellow',
})

module.exports = {
  name: 'init',
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem } = toolbox
    load.start('Creating your schema...')

    // await filesystem.fileAsync()

    load.succeed('Your Prisloc schema was created at prisloc/schema.prisloc.')
  },
}
