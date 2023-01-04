import { build } from 'gluegun'

async function run(argv) {
  const cli = build()
    .brand('prisloc')
    .src(__dirname)
    .plugins('./node_modules', { matching: 'cli-*', hidden: true })
    .help()
    .version()
    .create()
  const toolbox = await cli.run(argv)

  return toolbox
}

module.exports = { run }
