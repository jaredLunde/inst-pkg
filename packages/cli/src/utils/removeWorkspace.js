import {getRootPkg} from '@inst-cli/template-utils'
import path from 'path'
import writeFile, {writeFileSync} from './writeFile'

export default function removeWorkspace(pkg) {
  const rootPkgJSON = getRootPkg()
  const rootPkgJSONData = rootPkgJSON.value
  const relPkgPath = path.relative(path.dirname(rootPkgJSON.filename), pkg)
  const pkgName = path.basename(pkg)

  if (rootPkgJSONData.workspaces.includes(relPkgPath)) {
    rootPkgJSONData.workspaces.splice(rootPkgJSONData.workspaces.indexOf(relPkgPath), 1)
  }

  if (rootPkgJSONData.scripts[pkgName] !== void 0) {
    delete rootPkgJSONData.scripts[pkgName]
  }

  delete rootPkgJSONData.__path
  return writeFile(rootPkgJSON.filename, JSON.stringify(rootPkgJSONData, null, 2))
}

export function removeWorkspaceSync(pkg) {
  const rootPkgJSON = getRootPkg()
  const rootPkgJSONData = rootPkgJSON.value
  const relPkgPath = path.relative(path.dirname(rootPkgJSON.filename), pkg)
  const pkgName = path.basename(pkg)

  if (rootPkgJSONData.workspaces.includes(relPkgPath)) {
    rootPkgJSONData.workspaces.splice(rootPkgJSONData.workspaces.indexOf(relPkgPath), 1)
  }

  if (rootPkgJSONData.scripts[pkgName] !== void 0) {
    delete rootPkgJSONData.scripts[pkgName]
  }

  delete rootPkgJSONData.__path
  return writeFileSync(rootPkgJSON.filename, JSON.stringify(rootPkgJSONData, null, 2))
}
