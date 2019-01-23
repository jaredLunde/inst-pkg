import {flag, log} from '@inst-app/template-utils'
import fs from 'fs-extra'
import ncp from 'ncp'
import path from 'path'
import mkdirs from './mkdirs'


ncp.limit = 16

export default async function copy (from, to, {include, exclude}) {
  const dir = path.dirname(to)

  if (fs.existsSync(dir) === false) {
    await mkdirs(dir)
  }

  return new Promise(
    (resolve, reject) => ncp(
      from,
      to,
      {
        filter: (source) => {
          if (typeof exclude === 'function') {
            return exclude(source) === false
          }

          if (typeof include === 'function') {
            return include(source)
          }

          return true
        }
      },
      err => {
        if (err) {
          reject(err)
          throw new Error(err)
        }

        // log(flag('copy'), from, to)
        resolve()
      }
    )
  )
}
