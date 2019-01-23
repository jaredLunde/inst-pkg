import memoize from 'memoize-two-args'
import path from "path"
import fs from "fs"
import {getRootPkgFilename} from '@inst-app/template-utils'
import findTemplateName from './findTemplateName'


export default memoize((pkgDir, templateName) => {
  const pkgName = findTemplateName(pkgDir, templateName)
  const pkgNodeModules = path.join(pkgDir, 'node_modules', pkgName)

  if (fs.existsSync(pkgNodeModules)) {
    return pkgNodeModules
  }
  else {
    const rootPkgFilename = getRootPkgFilename(pkgDir)
    return path.join(path.dirname(rootPkgFilename), 'node_modules', pkgName)
  }
}, Map)