import template from '@inst-app/basic-template'


const opt = {
  prop: /<:([\sA-Z0-9_]+?):>/g
}

export default function render (source, data) {
  return template(source, opt)(data)
}
