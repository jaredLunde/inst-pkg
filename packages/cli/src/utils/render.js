import template from '@inst-cli/basic-template'

const opt = {
  prop: /<:([\sa-zA-Z0-9_.]+?):>/g,
}

export default function render(source, data) {
  return template(source, opt)(data)
}
