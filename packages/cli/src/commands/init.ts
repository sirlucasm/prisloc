import { GluegunToolbox } from 'gluegun'
import loading from 'loading-cli'
import { Engine } from '@prisloc/core'
import { PromptOptions } from 'gluegun/build/types/toolbox/prompt-enquirer-types'

const load = loading({
  color: 'yellow',
})

module.exports = {
  name: 'init',
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem, prompt } = toolbox

    const engine = new Engine()

    const questionWantCustomPath: PromptOptions = {
      type: 'confirm',
      name: 'isCustomPath',
      message: 'Want to set up a custom path?',
    }

    const questionCustomPath: PromptOptions = {
      type: 'input',
      name: 'customPath',
      message: 'Specify your custom path',
      initial: engine.path,
    }

    const { isCustomPath } = await prompt.ask(questionWantCustomPath)

    if (isCustomPath) {
      const { customPath } = await prompt.ask(questionCustomPath)
      engine.setPath(customPath)
    }

    load.start('Creating your schema...')

    const schema = engine.start()

    await filesystem.fileAsync(engine.path, { content: schema })

    load.succeed(`Your Prisloc schema was created at ${engine.path}.`)
  },
}
