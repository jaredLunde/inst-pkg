import fs from 'fs'
import p from 'path'
import walkSync from 'klaw-sync'
import {promisify} from 'util'
import mkdirs from './mkdirs'

const fsRename = promisify(fs.rename)
const cleanEmptyDirs = async directory => {
  if (!fs.existsSync(directory)) {
    return cleanEmptyDirs(p.dirname(directory))
  }

  if (fs.existsSync(directory) && fs.readdirSync(directory).length === 0) {
    fs.rmdirSync(directory)
    return cleanEmptyDirs(p.dirname(directory))
  }
}

export default async (path, renameFn) => {
  const removedPaths = []

  await Promise.all(
    walkSync(path, {
      depthLimit: -1,
      filter: ({path}) => path.includes('/node_modules/') === false,
    }).map(async ({path, stats}) => {
      if (stats.isDirectory() === false && fs.existsSync(path)) {
        const next = renameFn(path)
        removedPaths.push(p.dirname(path))
        await mkdirs(p.dirname(next))
        return fsRename(path, next)
      }
    })
  )

  removedPaths.map(cleanEmptyDirs)
}
