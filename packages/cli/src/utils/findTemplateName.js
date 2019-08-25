import memoize from 'memoize-two-args'
import {getPkgJson, getRootPkgFilename} from '@inst-cli/template-utils'
import * as lockfile from '@yarnpkg/lockfile'
import fs from "fs"


export default memoize((pkgDir, templateName) => {
  let pkgName = templateName

  if (templateName.match(/^https?:/)) {
    // git
    // has to be found via the lockfile
    const rootPkgFilename = getRootPkgFilename(pkgDir)
    const lockfileName = rootPkgFilename.replace(/package\.json$/, 'yarn.lock')
    const lock = lockfile.parse(fs.readFileSync(lockfileName, 'utf8'))

    for (let key of Object.keys(lock.object)) {
      if (key.endsWith(`@${templateName}`)) {
        pkgName = key.split(`@${templateName}`)[0]
        break
      }
    }
  }
  else if (templateName.startsWith('file:')) {
    // local package
    pkgName = getPkgJson(templateName.replace(/^file:/, '')).name
  }
  else {
    pkgName = pkgName.split('@')
    pkgName = (pkgName.length > 2 ? pkgName.slice(0, -1) : pkgName).join('@')
    pkgName = pkgName.startsWith('@') === false ? pkgName.split('@')[0] : pkgName
  }

  return pkgName
}, Map)