import {flag, log, getRootPkg} from '@inst-cli/template-utils'
import path from 'path'
import writeFile from './writeFile'


export default function addWorkspace (pkg) {
  const rootPkgJSON = getRootPkg()
  const rootPkgJSONData = rootPkgJSON.value
  const relPkgPath = path.relative(path.dirname(rootPkgJSON.filename), pkg)
  const pkgName = path.basename(pkg)

  if (!rootPkgJSONData.workspaces.includes(relPkgPath)) {
    rootPkgJSONData.workspaces.push(relPkgPath)
  }

  if (rootPkgJSONData.scripts[pkgName] !== void 0) {
    log(
      flag('Error', 'red'),
      `could not create workspace for ${flag(pkgName)}. A package with this name is already exists.`
    )

    return false
  }
  else {
    rootPkgJSONData.scripts[pkgName] =
      `INIT_CWD=${relPkgPath} yarn --cwd=${relPkgPath}`
  }

  delete rootPkgJSONData.__path
  return writeFile(rootPkgJSON.filename, JSON.stringify(rootPkgJSONData, null, 2))
}
