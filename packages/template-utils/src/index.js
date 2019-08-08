import chalk from 'chalk'
import findPkgJSON from 'find-package-json'

export * from './prompts'
export cmd from './cmd'
export const pwd = () => process.env.PWD || process.cwd()
export const trim = s => s.trim()
export const required = s => !!s
export const log = (...msgs) => console.log('⚘', ...msgs)
export const error = (...msgs) => log(flag('Error', 'red'), ...msgs)
export const success = (...msgs) => console.log(flag('⚘', 'green'), ...msgs)
export const flag = (msg, color = 'white') => `${chalk.bold[color](msg)}`
export const line = (char = '-', color = 'white') => chalk[color](char.repeat(80))

export function getRootPkg (dir = pwd()) {
  const finder = findPkgJSON(dir)
  let pkgJSON = finder.next()

  while (pkgJSON.done === false) {
    if (pkgJSON.value.inst && pkgJSON.value.inst.root === true) {
      return pkgJSON
    }

    pkgJSON = finder.next()
  }
}

export const getRootPkgJson = () => getRootPkg()?.value
export const getRootPkgFilename = () => getRootPkg()?.filename

export const getPkg = (dir = pwd()) => findPkgJSON(dir).next()
export const getPkgJson = dir => getPkg(dir).value
export const getPkgFilename = dir => getPkg(dir).filename