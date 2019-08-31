import {spawn} from 'child_process'
import path from 'path'
import {log} from './log'

export default (dirname, argv) => {
  const cmd = [`inst-cli`, `new`, `file:${path.join(dirname, '../')}`, ...argv.slice(2)]
  log('npx', cmd.join(' '))
  return spawn(`npx`, cmd, {stdio: 'inherit'})
}
