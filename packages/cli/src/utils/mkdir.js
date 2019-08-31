import fs from 'fs-extra'

export default function mkdir(p, mode = 0o744) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(p) === false) {
      fs.mkdir(p, mode, err => {
        if (err) {
          reject(err)
          throw new Error(err)
        }

        // log(flag('mkdir'), p)
        resolve()
      })
    } else {
      resolve()
    }
  })
}
