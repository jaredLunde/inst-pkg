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
  success,
  getPkgJson,
  getRootPkgJson,
} from '@inst-cli/template-utils'
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
  writeFile,
} from './utils'

let FINISHED = false

function handleExit(pkgDir) {
  let EXITING = false

  function clean() {
    const spinner = ora({spinner: 'dots3', color: 'gray'}).start('Cleaning up')
    try {
      rimraf.sync(pkgDir)
      removeWorkspaceSync(pkgDir)
    } catch (err) {
      // eslint-disable-next-line no-empty
    } finally {
      spinner.succeed(flag('Cleaned up'))
    }
  }

  function intHandler(...args) {
    if (EXITING === true) {
      return
    }

    EXITING = true
    console.log('\n', ...args)
    clean()
    error('inst failed to install your template')
    process.exit(1)
  }

  function exitHandler(code) {
    if (EXITING === true || FINISHED === true) {
      return
    }

    EXITING = true
    clean()

    if (code != 0) {
      error('inst failed to install your template')
    } else {
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

export default async function add({name, template, cwd, ...args}) {
  if (!template) {
    template = name
    name = void 0
  }

  // inits the variables object which will be passed to the template installer
  const PWD = cwd ? path.join(pwd(), cwd) : pwd()
  const rootPkgJson = getRootPkgJson(PWD)
  let variables = {
    PKG_NAME: name,
    ROOT_NAME: rootPkgJson ? name : null,
    ROOT_DIR: rootPkgJson ? path.dirname(rootPkgJson.__path) : null,
  }

  // if there wasn't a name provided, prompt for one
  if (name === void 0) {
    variables = {
      ...variables,
      ...(await inquirer.prompt([
        {
          ...promptDefaults,
          name: 'PKG_NAME',
          message: 'Package name:',
          filter: trim,
          validate: required,
        },
      ])),
    }
  }

  // helps spot early errors in CLI configs
  log(
    `Creating new${variables.ROOT_NAME ? ' workspace' : ''} package ${flag(
      variables.PKG_NAME
    )} with template ${flag(template)}`
  )
  variables.PKG_DIR = path.join(PWD, variables.PKG_NAME)

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
  if (rootPkgJson) {
    const ws = await addWorkspace(variables.PKG_DIR)
    // exits gracefully if workspace already exists
    if (ws === false) {
      FINISHED = true
      return
    }
  }

  // installs the template
  let spinner = ora({spinner: 'dots3', color: 'gray'}).start(
    `Installing template ${flag(template)}`
  )
  await cmd.get(`
    cd ${variables.PKG_DIR}
    yarn init -y
    yarn add ${template} --dev
  `)
  spinner.stop()

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
      ...(await templatePkg.getDefaultVariables(variables, pkgJson, args)),
    }
  }

  // prompts template for new variables
  if (templatePkg.prompts) {
    const prompts = (typeof templatePkg.prompts === 'function'
      ? templatePkg.prompts(variables, args, pkgJson, inquirer)
      : templatePkg.prompts
    ).map(p => ({...promptDefaults, ...p}))

    variables = {...variables, ...(await inquirer.prompt(prompts))}
  }

  // copies the template to the package directory and renders it
  spinner.start(`Rendering templates`)

  try {
    // if the package has its own copy function use that first
    if (templatePkg.copy) {
      await templatePkg.copy(variables, args)
    }

    // copy the package's lib to the package directory
    let include, exclude
    if (templatePkg.include) {
      include =
        typeof templatePkg.include === 'function'
          ? templatePkg.include(variables, args)
          : templatePkg.include
      include = include && !Array.isArray(include) ? [include] : include
    }

    if (templatePkg.exclude) {
      exclude =
        typeof templatePkg.exclude === 'function'
          ? templatePkg.exclude(variables, args)
          : templatePkg.exclude
    }

    await copy(path.join(templatePath, 'lib'), variables.PKG_DIR, {include, exclude})
    const instignorePath = path.join(templatePath, '.instignore')
    let instignore

    if (fs.existsSync(instignorePath)) {
      instignore = (await fs.promises.readFile(instignorePath, 'utf8')).split('\n')
    }

    await findReplace(variables.PKG_DIR, variables, instignore)
    spinner.stop()

    // renames files if there is a rename function in the template
    spinner.start(`Renaming files`)
    if (templatePkg.rename) {
      await rename(variables.PKG_DIR, filename => templatePkg.rename(filename, variables, args))
    }
    spinner.stop()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }

  // allows the template to edit the package.json, e.g. add scripts
  if (templatePkg.editPackageJson) {
    pkgJson = await templatePkg.editPackageJson({...pkgJson}, variables, args)

    if (!pkgJson || Object.keys(pkgJson).length === 0) {
      log(
        flag('Error', 'red'),
        `package.json cannot be empty. Please check your template's`,
        flag('editPackageJson()'),
        `function to make sure you're returning a valid package.json object.`
      )
      process.exit(1)
    }
  }
  // adds dependencies to package.json
  pkgJson.dependencies =
    typeof templatePkg.dependencies === 'function'
      ? templatePkg.dependencies(variables, args)
      : templatePkg.dependencies
  pkgJson.devDependencies = {
    ...pkgJson.devDependencies,
    ...(typeof templatePkg.devDependencies === 'function'
      ? templatePkg.devDependencies(variables, args)
      : templatePkg.devDependencies),
  }
  pkgJson.peerDependencies =
    typeof templatePkg.peerDependencies === 'function'
      ? templatePkg.peerDependencies(variables, args)
      : templatePkg.peerDependencies
  // writes the package.json file
  delete pkgJson.__path
  await writeFile(
    path.join(variables.PKG_DIR, 'package.json'),
    JSON.stringify(pkgJson, null, 2)
  )
  // initiates a git repo if not a workspace
  if (!rootPkgJson && !args.g && !args.gitless) {
    // we do git first beccause some deps may depend on it
    await cmd.get(`
      cd ${variables.PKG_DIR}
      git init
      git add .
      git commit -m "Installed package from template: \\"${templateName}\\""
    `)
  }
  // installs the template package dependencies
  await installDeps(variables.PKG_DIR)

  spinner.start('Cleaning up template packages from node_modules')
  await cmd.get(`
     cd ${variables.PKG_DIR}
     yarn remove ${templateName}
  `)
  spinner.stop()

  // commits deps if not a workspace
  if (!rootPkgJson && !args.ng && !args.gitless) {
    // we do git first beccause some deps may depend on it
    await cmd.get(`
      cd ${variables.PKG_DIR}
      git add .
      git commit -m "Installed package dependencies"
    `)
  }
  // donezo
  success(
    flag(variables.PKG_NAME),
    'was created in',
    `./${flag(path.relative(process.cwd(), variables.PKG_DIR))}`
  )

  FINISHED = true
}
