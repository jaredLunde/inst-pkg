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
export const ARGNAME = 'props'
const unescapeRe = /\\('|\\)/g
const spaceRe = /[\r\t\n\s]/g


function unescape(code) {
  return code.replace(unescapeRe, '$1').replace(spaceRe, ' ')
}

// TODO: escape cmp quotes
function transformConditional (m, elseCase, code) {
  let [prop, ...cmp] = code.trim().split(' ')
  cmp =
    cmp.length
    ? `${ARGNAME}.${prop} ${cmp.join(' ')}`
    : prop === 'else'
      ? void 0
      : `${ARGNAME}.${prop} !== void 0 && ` +
        `${ARGNAME}.${prop} !== null && ` +
        `${ARGNAME}.${prop} !== false `
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

function transformProp (m, prop) {
  return `'+(${ARGNAME}.${unescape(prop)} || '');value+='`
}

function injectScript (m, code) {
  return `';${unescape(code)};value+='`
}

const defaultOptions = {
  prop: /<:([\s\w\.]+?):>/g,
  conditional: /<:\s*(if|elif|else|fi)\b([\s\S]*?)\s*:>/g,
  scripting: /<:\(([\s\S]+?)\):>/g,
  callback: void 0,
  plugins: void 0
}

const r1 = /'|\\/g
const r2 = /\n/g
const r3 = /\t/g
const r4 = /\r/g
const r5 = /(\s|;|\}|^|\{)value\+='';/g
const r6 = /\+''/g

function compile (string, options) {
  const {prop, conditional, scripting, plugins} = Object.assign({}, defaultOptions, options)
  string = string
    .replace(r1, '\\$&')
    .replace(scripting || skip, injectScript)
    .replace(conditional || skip, transformConditional)
    .replace(prop || skip, transformProp)

  if (plugins !== void 0) {
    for (let x = 0; x < plugins.length; x++) {
      string = plugins[x](string, options)
    }
  }

  return new Function(
    ARGNAME,
    `var value='${string}';return value;`
      .replace(r2, '\\n')
      .replace(r3, '\\t')
      .replace(r4, '\\r')
      .replace(r5, '$1')
      .replace(r6, '')
  )
}

export default compile
