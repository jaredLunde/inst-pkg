import {log, flag, cmd} from '@inst-pkg/template-utils'
import ora from 'ora'


function formatDeps (deps) {
  return Object.keys(deps).map(k => `${k}@${deps[k]}`).join(' ')
}

export default async function installDeps (
  pkgDir,
  {dependencies, devDependencies, peerDependencies}
) {
  const spinner = ora({spinner: 'point'}).start(`${flag('Installing dependencies')} ${pkgDir}`)
  let data

  try {
    data = await cmd.get(`
       cd ${pkgDir}
       ${peerDependencies && Object.keys(peerDependencies).length > 0
        ? `yarn add --peer ${formatDeps(peerDependencies)}`
        : ''}
       ${devDependencies && Object.keys(devDependencies).length > 0
        ? `yarn add --dev ${formatDeps(devDependencies)}`
        : ''}
       ${dependencies && Object.keys(dependencies).length > 0
        ? `yarn add ${formatDeps(dependencies)}`
        : ''}
    `)

    spinner.succeed(flag('Installed dependencies'))
  }
  catch (err) {
    spinner.error(flag('Experienced error installing dependencies'))
    console.log(err)
    throw err
  }

  return data
}
