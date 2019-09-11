import fs from 'fs-extra'
import multimatch from 'multimatch'
import {error} from '@inst-cli/template-utils'
import writeFile from './writeFile'
import renderDefault from './render'
import walk from './walk'

export default async function findReplace(
  dir,
  variables,
  {render = renderDefault, ignore = []}
) {
  let files = walk(dir, {nodir: true, ignore: f => f.match(/\/node_modules\//)})
  ignore = multimatch(files.map(file => file.path), ignore, {dot: true, nodir: true})
  files = files.filter(f => !ignore.includes(f.path))

  for (let f of files) {
    const data = await fs.promises.readFile(f.path, 'utf8')
    let nextData
    try {
      nextData = render(data, variables)
    } catch (err) {
      error(`Couldn't render template:`, f.path)
      process.exit(1)
    }

    if (nextData && nextData !== data) {
      fs.unlink(f.path)
      await writeFile(f.path, nextData)
    }
  }
}
