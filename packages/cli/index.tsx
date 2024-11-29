import { build } from 'gluegun'

export async function run(argv: string[]) {
  try {
    const cli = build().brand('prisloc').src(__dirname).defaultCommand().help().version().create()

    const toolbox = await cli.run(argv)

    return toolbox
  } catch {}
}
