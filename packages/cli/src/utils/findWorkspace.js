import {flag, log, getRootPkg} from '@inst-app/template-utils'
import path from 'path'


export default function findWorkspace (name) {
  const rootPkgJSON = getRootPkg()
  const rootPkgJSONData = rootPkgJSON.value

  for (let workspace of rootPkgJSONData.workspaces) {
    if (path.basename(workspace) === name) {
      return path.join(path.dirname(rootPkgJSON.filename), workspace)
    }
  }

  log(flag('Error', 'red'), 'workspace not found:', flag(name, 'white'))
  process.exit()
}
