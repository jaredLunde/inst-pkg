import {flag, cmd} from '@inst-cli/template-utils'
import ora from 'ora'

export default async function installDeps(pkgDir) {
  const spinner = ora({spinner: 'dots3', color: 'gray'}).start(
    `${flag('Installing dependencies')} ${pkgDir}`
  )
  let data

  try {
    data = await cmd.get(`
       cd ${pkgDir}
       yarn install
    `)

    spinner.succeed(flag('Installed dependencies'))
  } catch (err) {
    spinner.error(flag('Experienced error installing dependencies'))
    console.log(err)
    throw err
  }

  return data
}
