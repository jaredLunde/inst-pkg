import findPkgJSON from 'find-package-json'

export * from './log'
export * from './prompts'
export bin from './bin'
export cmd from './cmd'
export const pwd = () => process.env.PWD || process.cwd()
export const trim = s => s.trim()
export const required = s => !!s

export function getRootPkg(dir = pwd()) {
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
