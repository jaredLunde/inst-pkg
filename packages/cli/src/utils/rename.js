import fs from 'fs'
import p from 'path'
import {promisify} from 'util'
import glob from './glob'
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

export default async (path, renameFn, {include = ['**'], exclude}) => {
  if (Array.isArray(exclude)) {
    exclude.push('node_modules')
  } else if (exclude) {
    exclude = [exclude, 'node_modules']
  } else {
    exclude = ['node_modules']
  }

  const removedPaths = []
  const files = []

  for (let pattern of include) {
    for (let file of await glob(path, pattern, exclude)) {
      files.push(file)
    }
  }

  for (let file of files) {
    const next = renameFn(file)
    removedPaths.push(p.dirname(file))
    await mkdirs(p.dirname(next))
    await fsRename(file, next)
  }

  removedPaths.map(cleanEmptyDirs)
}
