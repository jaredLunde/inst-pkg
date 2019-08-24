import chalk from 'chalk'


export const log = (...msgs) => console.log('⚘', ...msgs)
export const error = (...msgs) => log(flag('Error', 'red'), ...msgs)
export const success = (...msgs) => console.log(flag('⚘', 'green'), ...msgs)
export const flag = (msg, color = 'white') => `${chalk.bold[color](msg)}`
export const line = (char = '-', color = 'white') => chalk[color](char.repeat(80))