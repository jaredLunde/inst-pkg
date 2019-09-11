import fs from 'fs-extra'
import multimatch from 'multimatch'
import writeFile from './writeFile'
import renderDefault from './render'
import walk from './walk'

export default async function findReplace(
  dir,
  variables,
  {render = renderDefault, ignore = []}
) {
  let files = walk(dir, {nodir: true, ignore: f => f.path.match(/\/node_modules\//)})
  ignore = multimatch(files.map(file => file.path), ignore, {dot: true, nodir: true})
  files = files.filter(f => !ignore.includes(f.path))

  for (let f of files) {
    const data = await fs.promises.readFile(f.path, 'utf8')
    const nextData = render(data, variables)

    if (nextData && nextData !== data) {
      fs.unlink(f.path)
      await writeFile(f.path, nextData)
    }
  }
}
