[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://jaredlunde.mit-license.org/)

---

# @inst-cli/template

A fast and simple template engine with variables, conditionals, and inline code blocks

## Installation

#### `npm i @inst-cli/template`

#### `yarn add @inst-cli/template`

## Usage

```js
import compile from '@inst-cli/template'
let tpl = compile(`
  Hello, <:name:>
  
  <:if lastName:> 
    Is "<:lastName:>" really your last name?
  <:elif lastName === 'Smith':>
    Why do you have such a boring last name?
  <:else:>
    Y u no have last name?
  <:fi:>
    
  <:(
    value += "inline code ";
    
    for (let i = 0; i < vars.words.length; i++) {
      value += vars.words[i] + " ";
    }
  ):>
`)

tpl({name: 'jared', lastName: 'lunde', words: ['is', 'pretty', 'neat']})
//
//  Hello, jared
//
//
//    Is "lunde" really your last name?
//
//
//  inline code is pretty neat
//
```

## LICENSE

MIT
