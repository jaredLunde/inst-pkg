import chalk from 'chalk'
import yargs from 'yargs'
import {log, flag} from '@inst-cli/template-utils'
import {version} from '../../package.json'
import * as docs from './docs'
import workspace from './workspace'
import add from './add'
import template from './template'

const instBanner = `${flag('inst', 'grey')} ${chalk.grey(`v${version}`)} `

export default async function bin() {
  log(instBanner)
  // parses the arguments w/ yargs
  yargs.scriptName('inst')

  yargs.command('workspace [project-name]', docs.workspace, yargs => {
    yargs.positional('project-name', {
      describe: 'The name of your Yarn workspaces project',
    })
  })

  yargs.command('new [template] [name] [-n|--no-git] [--cwd directory]', docs.add, yargs => {
    yargs.positional('template', {
      describe: 'The NPM package, git repository, or local template to create a package from',
    })

    yargs.positional('name', {
      describe: 'The name of the new package',
    })

    yargs.option('no-git', {
      alias: 'n',
      describe:
        'Creates the template package without git. This is only relevant in ' +
        'outside of a workspace.',
    })

    yargs.option('cwd', {
      describe: 'Joins the process.cwd() to this path when creating the environment',
    })
  })

  yargs.command('template [template-name] [--cwd directory]', docs.template, yargs => {
    yargs.positional('template-name', {
      describe: `The name of the new template you're creating`,
    })

    yargs.option('cwd', {
      describe: 'Joins the process.cwd() to this path when creating the environment',
    })
  })

  const args = yargs.argv

  // the command is the first argument
  const [cmd] = args._

  // routes the cmd
  switch (cmd) {
    case 'workspace':
      // init takes one argument optionally, for the project name
      await workspace(args)
      break
    case 'new':
      await add(args)
      break
    case 'template':
      await template(args)
      break
    default:
      log(
        flag('Error', 'red'),
        cmd ? 'command not found:' : 'No command was provided.',
        cmd ? `"${cmd}".` : '',
        'See --help for a list of commands.'
      )
  }

  log(chalk.grey('❋❋ done ❋❋'))
}
