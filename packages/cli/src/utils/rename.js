import fs from 'fs'
import walkSync from 'klaw-sync'
import {promisify} from 'util'

const fsRename = promisify(fs.rename)

export default async function rename(path, renameFn) {
  await Promise.all(
    walkSync(path, {
      depthLimit: -1,
      filter: ({path}) => path.includes('/node_modules/') === false,
    }).map(({path, stats}) => {
      if (stats.isDirectory() === false && fs.existsSync(path)) {
        return fsRename(path, renameFn(path))
      }
    })
  )

  return Promise.all(
    walkSync(path, {
      nofile: true,
      depthLimit: -1,
      filter: ({path}) =>
        path.match(/\/node_modules$/) === null && path.match(/\/node_modules\//) === null,
    }).map(({path}) => {
      if (fs.existsSync(path)) {
        return fsRename(path, renameFn(path))
      }
    })
  )
}
