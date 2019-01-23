import path from 'path'
import inquirer from 'inquirer'
import {trim, required, pwd, cmd, getPkgJson, getPkgFilename} from '@inst-app/template-utils'
import {promptDefaults, mkdir, writeFile} from './utils'


const defaultGitIgnore = `
node_modules/
dist/
.DS_Store
*.log
.idea
`.trim()

export default async function init ({projectName}) {
  const basename = path.basename(pwd())
  let variables = {NAME: projectName}
  // prompts the user for a package name if none is defined
  if (!projectName) {
    variables = await inquirer.prompt([{
      ...promptDefaults,
      name: 'NAME',
      message: 'Project name:',
      default: basename,
      filter: trim,
      validate: required
    }])
  }
  // creates the new package directory
  let pkgDir

  if (!projectName && variables.NAME === basename) {
    pkgDir = pwd()
  }
  else {
    pkgDir = path.join(pwd(), variables.NAME)
    await mkdir(pkgDir)
  }
  // init the new workspace w/ yarn
  await cmd.get(`yarn init -y --cwd ${pkgDir}`)
  // write the new package.json with inst props
  const pkgJson = {
    ...getPkgJson(pkgDir),
    inst: {
      root: true
    },
    private: true,
    workspaces: [],
    scripts: {
      inst: 'inst add --cwd packages'
    }
  }
  // writes the updated package.json
  delete pkgJson.__path
  await writeFile(getPkgFilename(pkgDir), JSON.stringify(pkgJson, null, 2))
  // creates default README and gitignore files
  await writeFile(path.join(pkgDir, 'README.md'), `# ${variables.NAME}`)
  await writeFile(path.join(pkgDir, '.gitignore'), defaultGitIgnore)
  // creates the packages folder for the workspace
  await mkdir(path.join(pkgDir, 'packages'))
}