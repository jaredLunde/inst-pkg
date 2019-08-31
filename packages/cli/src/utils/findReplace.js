import fs from 'fs-extra'
import multimatch from 'multimatch'
import writeFile from './writeFile'
import render from './render'
import walk from './walk'

export default async function findReplace(dir, variables, ignore = []) {
  let files = walk(dir, {nodir: true})
  ignore = multimatch(files, ignore, {dot: true})
  files = files.filter(f => !ignore.includes(f))

  for (let f of files) {
    const data = await fs.promises.readFile(f.path, 'utf8')
    const nextData = render(data, variables)

    if (nextData && nextData !== data) {
      fs.unlink(f.path)
      await writeFile(f.path, nextData)
    }
  }
}
