import {cmd} from '@inst-cli/template-utils'
import ora from 'ora'
import chalk from 'chalk'

export default async function installDeps(pkgDir) {
  const spinner = ora({spinner: 'dots3', color: 'gray'}).start(
    `Installing dependencies ${chalk.gray(pkgDir)}`
  )
  let data

  try {
    data = await cmd.get(`
       cd ${pkgDir}
       yarn install
    `)

    spinner.stop()
  } catch (err) {
    spinner.error('Experienced error installing dependencies')
    console.log(err)
    throw err
  }

  return data
}
