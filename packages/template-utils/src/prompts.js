import autocompletePrompt from 'inquirer-autocomplete-prompt'
import ini from 'ini'
import fuzzy from 'fuzzy'
import fs from 'fs'


export function autocompleteIni (inquirer, filename, opt) {
  inquirer.registerPrompt('autocomplete', autocompletePrompt)
  const file = fs.existsSync(filename) &&
    ini.parse(fs.readFileSync(filename, 'utf-8'))
  return {
    type: 'autocomplete',
    ...opt,
    source: opt.source ? (...args) => opt.source(file, ...args) : (answers, input) => {
      input = input || ''
      const fuzzyResult = fuzzy.filter(input, Object.keys(file))
      return new Promise(resolve => resolve(fuzzyResult.map(el => el.original)))
    },
  }
}

