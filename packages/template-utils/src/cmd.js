import childProc from 'child_process'

function runCommand(command) {
  return childProc.exec(command, {maxBuffer: 1024 * 1024 * 100})
}

function getString(command, callback) {
  const proc = childProc.spawn(command, [], {stdio: 'pipe', shell: true})

  let data = '',
    err = ''
  proc.stdout.on('data', function(nextData) {
    if (nextData && nextData.length > 0) {
      data += nextData
    }
  })

  proc.stderr.on('data', function(nextErr) {
    if (nextErr && nextErr.length > 0) {
      err += nextErr
    }
  })

  proc.on('close', code => {
    callback(err, data, code)
  })

  return proc
}

export default {
  get: (command, callback) => {
    return new Promise((resolve, reject) =>
      getString(command, (err, data, code) => {
        callback && callback(err, data, code)

        if (!err || code == 0) {
          resolve(data)
        } else {
          reject(err)
          throw new Error(err)
        }
      })
    )
  },
  run: runCommand,
}
