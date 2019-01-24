import {flag, log} from '@inst-pkg/template-utils'
import fs from 'fs-extra'


export default function mkdirs (p, mode = 0o744) {
  return new Promise(
    (resolve, reject) => fs.mkdirs(p, mode, err => {
      if (err) {
        reject(err)
        throw new Error(err)
      }

      resolve()
    })
  )
}
