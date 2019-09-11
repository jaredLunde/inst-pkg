/*
 A very stripped down version of doT by Laura Doktorova
 - https://github.com/olado/doT

 <:HELLO:>

 <:if SOME_CONDITIONAL_PROP:>
 prints this text if SOME_CONDITIONAL_PROP is truthy
 <:fi:>

 <:(value+='foo'):>
 */
const skip = /$^/
export const ARGNAME = 'vars'
const unescapeRe = /\\('|\\)/g
const spaceRe = /[\r\t\n\s]/g
const unescape = code => code.replace(unescapeRe, '$1').replace(spaceRe, ' ')

const transformConditional = (m, elseCase, code) => {
  let [kw, ...cmp] = code.trim().split(' ')
  let prefix = ''
  if (kw.startsWith('!')) {
    prefix = kw.match(/!/g).join('')
    kw = kw.replace(/^!+/g, '')
  }
  cmp = cmp.length
    ? `${prefix}${ARGNAME}.${kw} ${cmp.join(' ')}`
    : `${prefix}${ARGNAME}.${kw}`
  cmp = unescape(cmp)

  switch (elseCase) {
    case 'if':
      return `';if(${cmp}){value+='`
    case 'elif':
      return `';}else if(${cmp}){value+='`
    case 'else':
      return `';}else{value+='`
    default:
      return `';}value+='`
  }
}

const transformProp = (m, prop) =>
  `'+(${ARGNAME}.${unescape(prop)} || '');value+='`
const injectScript = (m, code) => `';${unescape(code)};value+='`

const defaultOptions = {
  vars: /<:([\s\w.]+?):>/g,
  conditional: /<:\s*(if|elif|else|fi)\b([\s\S]*?)\s*:>/g,
  scripting: /<:\(([\s\S]+?)\):>/g,
  plugins: void 0,
}

const r1 = /'|\\/g
const r2 = /\n/g
const r3 = /\t/g
const r4 = /\r/g
const r5 = /(\s|;|\}|^|\{)value\+='';/g
const r6 = /\+''/g

const compile = (input, options) => {
  const {vars, conditional, scripting, plugins} = Object.assign(
    {},
    defaultOptions,
    options
  )
  let string = input
    .replace(r1, '\\$&')
    .replace(scripting || skip, injectScript)
    .replace(conditional || skip, transformConditional)
    .replace(vars || skip, transformProp)

  if (plugins !== void 0) {
    for (let x = 0; x < plugins.length; x++) {
      string = plugins[x](string, options)
    }
  }

  let fn = `var value='${string}';return value;`
    .replace(r2, '\\n')
    .replace(r3, '\\t')
    .replace(r4, '\\r')
    .replace(r5, '$1')
    .replace(r6, '')

  try {
    return new Function(ARGNAME, fn)
  } catch (err) {
    throw new Error(`[@inst-cli/template] Error parsing template:\n` + input)
  }
}

export default compile
