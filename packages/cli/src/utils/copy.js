import fs from 'fs-extra'
import glob from './glob'
import path from 'path'
import mkdirs from './mkdirs'

export default async (from, to, {include = ['**'], exclude}) => {
  const dir = path.dirname(to)

  if (fs.existsSync(dir) === false) {
    await mkdirs(dir)
  }

  const files = []

  for (let pattern of include) {
    for (let file of await glob(from, pattern, exclude)) {
      files.push(file)
    }
  }

  for (let file of files) {
    await fs.copy(file, path.join(to, path.relative(from, file)))
  }
}
