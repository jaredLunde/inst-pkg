import {
  trim,
  required,
  cmd,
  pwd,
  log,
  error,
  success,
  flag,
  getPkgJson
} from '@inst-cli/template-utils'
import fs from 'fs'
import ora from 'ora'
import path from 'path'
import inquirer from 'inquirer'
import {mkdir, mkdirs, writeFile, promptDefaults, removeWorkspaceSync} from './utils'
import rimraf from 'rimraf'

let FINISHED = false
const README = `
# Using a template

## Basics of \`inst\` templating

## Creating your first template
### index.js
### lib

## Using a template
`.trim()

const BLANK_TEMPLATE = `
const {flag, required, trim} = require('@inst-cli/template-utils')

module.exports = {}

// creates template variables using Inquirer.js
// see https://github.com/SBoudrias/Inquirer.js#objects for prompt object examples
module.exports.prompts = (
  {ROOT_NAME, ROOT_DIR, PKG_NAME, PKG_DIR}, // default template variables 
  packageJson,                              // contents of the package.json file as a plain object
  args,                                     // the arguments passed to the CLI
  inquirer                                  // the inquirer prompt object
) => ([
  // See https://github.com/SBoudrias/Inquirer.js#objects
  // for valid prompts
])

// package.json dependencies
module.exports.dependencies = {
}

// package.json dev dependencies
module.exports.devDependencies = {
}

// package.json peer dependencies
module.exports.peerDependencies = {
}

// filter for only including template files that return \`true\` here
// NOTE: this function is never called if \`exclude\` is defined
module.exports.include = function include (filename, variables, args) {
  return true
}

// filter for excluding template files that return true here
// NOTE: this function takes precedence over include() above
// module.exports.exclude = function exclude (filename, variables, args) {
//   return false
// }

// filter for renaming files
module.exports.rename = function rename (filename, variables, args) {
  return filename
}

// runs after the package.json is created and deps are installed,
// used for adding scripts and whatnot
//
// this function must return a valid package.json object
module.exports.editPackageJson = function editPackageJson (
  packageJson, 
  variables, /*from prompts() above*/
  args
) {
  packageJson.scripts = {}
  
  // this function must return a valid package.json object
  return packageJson
}
`.trim()

const BIN = `
const {bin} = require('@inst-cli/template-utils')
bin(__dirname, process.argv)
`.trim()

function handleExit (tplDir) {
  let EXITING = false

  function clean () {
    const spinner = ora({spinner: 'point'}).start('Cleaning up')
    rimraf.sync(tplDir)
    spinner.succeed(flag('Cleaned up'))
  }

  function intHandler (...args) {
    if (EXITING === true) {
      return
    }

    EXITING = true
    console.log('\n', ...args)
    clean()
    error('inst failed to create your template')
    process.exit(1)
  }

  function exitHandler (code) {
    if (EXITING === true || FINISHED === true) {
      return
    }

    EXITING = true
    clean()

    if (code != 0) {
      error('inst failed to create your template')
    }
    else {
      log(flag('See ya'))
    }
  }

  //catches ctrl+c event
  process.on('SIGINT', intHandler)
  process.on('SIGTERM', intHandler)
  process.on('exit', exitHandler)

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', intHandler)
  process.on('SIGUSR2', intHandler)

  //catches uncaught exceptions
  process.on('uncaughtException', intHandler)
}

export default async function template ({templateName}) {
  const basename = path.basename(pwd())
  let variables = {TPL_NAME: templateName}
  // prompts the user for a package name if none is defined
  if (!templateName) {
    variables = await inquirer.prompt([{
      ...promptDefaults,
      name: 'TPL_NAME',
      message: 'Project name:',
      default: basename,
      filter: trim,
      validate: required
    }])
  }
  // sets the package directory
  if (!templateName && variables.TPL_NAME === basename) {
    variables.TPL_DIR = pwd()
  }
  else {
    variables.TPL_DIR = path.join(pwd(), variables.TPL_NAME)
    // make directory if it doesn't exist, otherwise exit
    if (fs.existsSync(variables.TPL_DIR)) {
      FINISHED = true
      error('package already exists', flag(variables.TPL_DIR))
      return
    }
    await mkdirs(variables.TPL_DIR)
  }
  // starts handling bad exit codes
  handleExit(variables.TPL_DIR)
  // installs template utils
  const spinner = ora({spinner: 'point'}).start(`${flag('Installing dependencies')}`)
  await cmd.get(`
    cd ${variables.TPL_DIR}
    yarn init -y
    yarn add @inst-cli/template-utils
  `)
  spinner.stop(flag('Installed dependencies'))
  // gets the package.json contents
  const pkgJson = getPkgJson(variables.TPL_DIR)
  pkgJson.name = variables.TPL_NAME
  pkgJson.bin = {
    [pkgJson.name]: 'bin/index.js'
  }
  pkgJson.files = [
    'lib',
    'bin',
    'index.js'
  ]
  delete pkgJson.__path
  // writes the new package.json file
  await writeFile(
    path.join(variables.TPL_DIR, 'package.json'),
    JSON.stringify(pkgJson, null, 2)
  )
  // writes the default files
  await writeFile(path.join(variables.TPL_DIR, 'README.md'), README)
  await writeFile(path.join(variables.TPL_DIR, 'index.js'), BLANK_TEMPLATE)
  // writes the lib folder
  await mkdir(path.join(variables.TPL_DIR, 'lib'))
  await mkdir(path.join(variables.TPL_DIR, 'bin'))
  await writeFile(path.join(variables.TPL_DIR, 'bin', 'index.js'), BIN)
  // donezo
  success(flag(variables.TPL_NAME), 'template was created at', flag(variables.TPL_DIR))

  FINISHED = true
}