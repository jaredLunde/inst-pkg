import fs from 'fs-extra'
import writeFile from './writeFile'
import render from './render'
import walk from './walk'


export default async function findReplace (dir, variables) {
  const files = walk(dir, {nodir: true})
  const proc = []

  for (let f of files) {
    await new Promise(
      (resolve, reject) => {
        fs.readFile(
          f.path,
          async (err, data) => {
            if (err) {
              reject(err)
              throw new Error(err)
            }

            data = data.toString()
            const nextData =
              f.path.includes('.inst.') && render(data.toString(), variables)

            if (nextData && nextData !== data) {
              fs.unlink(f.path)
              await writeFile(f.path.replace('.inst.', ''), nextData)
              resolve(nextData)
            }
            else {
              resolve(data)
            }
          }
        )
      }
    )
  }
}
