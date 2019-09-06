import findPkgJSON from 'find-package-json'
import path from 'path'
import fs from 'fs'

import {error} from './log'
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
export const findBin = bin => {
  const f = findPkgJSON(pwd())
  let pkg = f.next()
  let binPath

  while (pkg.done === false) {
    binPath = path.join(path.dirname(pkg.filename), 'node_modules/.bin', bin)

    if (fs.existsSync(binPath)) {
      return binPath
    }

    pkg = f.next()
  }

  const envPaths = process.env.PATH ? process.env.PATH.split(':') : []

  for (let env of envPaths) {
    binPath = path.join(env, bin)

    if (fs.existsSync(binPath)) {
      return binPath
    }
  }

  error(`Binary path not found for command: ${bin}`)
  process.exit(1)
}
