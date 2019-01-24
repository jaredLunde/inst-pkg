import inquirer from 'inquirer'
import path from 'path'
import fs from 'fs'
import ora from 'ora'
import rimraf from 'rimraf'
import importFrom from 'import-from'
import {
  trim,
  required,
  cmd,
  pwd,
  log,
  error,
  flag,
  line,
  success,
  getPkgJson,
  getRootPkgJson
} from '@inst-pkg/template-utils'
import {
  addWorkspace,
  removeWorkspaceSync,
  promptDefaults,
  mkdir,
  findReplace,
  copy,
  rename,
  findTemplateName,
  findTemplatePath,
  installDeps,
  writeFile
} from './utils'


let FINISHED = false

function handleExit (pkgDir) {
  let EXITING = false

  function clean () {
    const spinner = ora('Cleaning up').start()
    rimraf.sync(pkgDir)
    removeWorkspaceSync(pkgDir)
    spinner.succeed(flag('Cleaned up'))
  }

  function intHandler (...args) {
    if (EXITING === true) {
      return
    }

    EXITING = true
    console.log('\n', ...args)
    clean()
    error('inst failed to install your template')
    process.exit(1)
  }

  function exitHandler (code) {
    if (EXITING === true || FINISHED === true) {
      return
    }

    EXITING = true
    clean()

    if (code != 0) {
      error('inst failed to install your template')
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

export default async function add ({name, template, cwd, ...args}) {
  if (!template) {
    template = name
    name = void 0
  }

  // inits the variables object which will be passed to the template installer
  const rootPkgJson = getRootPkgJson(cwd ? path.join(pwd(), cwd) : pwd())
  let variables = {PKG_NAME: name, ROOT_NAME: rootPkgJson.name}

  // if there wasn't a name provided, prompt for one
  if (name === void 0) {
    variables = {
      ...variables,
      ...(
        await inquirer.prompt([
          {
            ...promptDefaults,
            name: 'PKG_NAME',
            message: 'Package name:',
            filter: trim,
            validate: required
          }
        ])
      )
    }
  }

  // helps spot early errors in CLI configs
  log(`Creating new workspace package ${flag(variables.PKG_NAME)} using template ${flag(template)}`)
  variables.PKG_DIR = path.join(cwd ? path.join(pwd(), cwd) : pwd(), variables.PKG_NAME)

  // make directory if it doesn't exist, otherwise exit
  if (fs.existsSync(variables.PKG_DIR)) {
    FINISHED = true
    error('package already exists', flag(variables.PKG_DIR))
    return
  }
  await mkdir(variables.PKG_DIR)

  // handles exits gracefully by cleaning up
  handleExit(variables.PKG_DIR)

  // creates the workspace package and installs the template
  const ws = await addWorkspace(variables.PKG_DIR)
  // exits gracefully if workspace already exists
  if (ws === false) {
    FINISHED = true
    return
  }

  // installs the template
  let spinner = ora(`Installing template ${flag(template)}`).start()
  await cmd.get(`
    cd ${variables.PKG_DIR}
    yarn init -y
    yarn add ${template} --dev
  `)
  spinner.succeed(flag('Installed template'))

  // gets the newly created package.json values as JS object
  let pkgJson = getPkgJson(variables.PKG_DIR)
  pkgJson.dependencies = {}
  pkgJson.peerDependencies = {}

  // imports the template module
  const templateName = findTemplateName(variables.PKG_DIR, template)
  const templatePath = findTemplatePath(variables.PKG_DIR, template)
  // log(`Importing template ${flag(templateName)} from ${flag(templatePath)}`)
  // const templatePkg = require(templatePath)
  const templatePkg = importFrom(variables.PKG_DIR, templateName)

  // gets any default variables from the template
  if (templatePkg.getDefaultVariables) {
    variables = {
      ...variables,
      ...(await templatePkg.getDefaultVariables(variables, pkgJson, args))
    }
  }

  // prompts template for new variables
  if (templatePkg.prompts) {
    console.log(line())

    const prompts = (
      typeof templatePkg.prompts === 'function'
        ? templatePkg.prompts(variables, pkgJson, args)
        : templatePkg.prompts
    ).map(
      p => ({...promptDefaults, ...p})
    )

    variables = {...variables, ...(await inquirer.prompt(prompts))}

    console.log(line())
  }
  log(flag('Template variables'), `\n${JSON.stringify(variables, null, 2)}`)

  // copies the template to the package directory and renders it
  spinner = ora(`Rendering templates for ${flag(templateName)}`).start()
  await copy(
    path.join(templatePath, 'lib'),
    variables.PKG_DIR,
    {
      include: templatePkg.include && (filename => templatePkg.include(filename, variables)),
      exclude: templatePkg.exclude && (filename => templatePkg.exclude(filename, variables)),
    }
  )
  await findReplace(variables.PKG_DIR, variables)
  spinner.succeed(flag('Rendered templates'))

  // renames files if there is a rename function in the template
  spinner = ora(`Renaming files in ${flag(variables.PKG_DIR)}`).start()
  if (templatePkg.rename) {
    await rename(variables.PKG_DIR, filename => templatePkg.rename(filename, variables))
  }
  spinner.succeed(flag('Renamed files'))

  // allows the template to edit the package.json, e.g. add scripts
  if (templatePkg.editPackageJson) {
    pkgJson = await templatePkg.editPackageJson({...pkgJson}, variables)

    if (!pkgJson || Object.keys(pkgJson).length === 0) {
      log(
        flag('Error', 'red'),
        `package.json cannot be empty. Please check your template's`,
        flag('editPackageJson()'),
        `function to make sure you're returning a valid package.json object.`
      )
      process.exit(1)
    }

    delete pkgJson.__path
    await writeFile(
      path.join(variables.PKG_DIR, 'package.json'),
      JSON.stringify(pkgJson, null, 2)
    )
  }

  // installs the template package dependencies
  await installDeps(variables.PKG_DIR, templatePkg)
  // donezo
  success(
    flag(variables.PKG_NAME),
    'was created at',
    flag(path.relative(process.cwd(), variables.PKG_DIR))
  )

  FINISHED = true
}