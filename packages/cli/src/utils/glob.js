import glob from 'glob'

const globOpt = {
  dot: true,
  absolute: true,
  nodir: true,
}

export default (cwd, pattern, ignore) =>
  new Promise((resolve, reject) =>
    glob(pattern, Object.assign({}, globOpt, {cwd}, ignore ? {ignore} : {}), (err, files) => {
      if (err) reject(err)
      resolve(files)
    })
  )
