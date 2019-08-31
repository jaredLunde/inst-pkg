import fs from 'fs-extra'
import glob_ from 'glob'
import path from 'path'
import mkdirs from './mkdirs'

const globOpt = {
  dot: true,
  absolute: true,
  nodir: true,
}

const glob = (cwd, pattern, ignore) =>
  new Promise((resolve, reject) =>
    glob_(pattern, Object.assign({}, globOpt, {cwd}, ignore ? {ignore} : {}), (err, files) => {
      if (err) reject(err)
      resolve(files)
    })
  )

export default async (from, to, {include = ['**'], exclude}) => {
  const dir = path.dirname(to)

  if (fs.existsSync(dir) === false) {
    await mkdirs(dir)
  }

  const files = new Set()

  for (let pattern of include) {
    for (let file of await glob(from, pattern, exclude)) {
      files.add(file)
    }
  }

  for (let file of files) {
    await fs.copy(file, path.join(to, path.relative(from, file)))
  }
}
