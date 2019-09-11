import template from '@inst-cli/template'

const opt = {
  vars: /<:([\sa-zA-Z0-9_.]+?):>/g,
}

export default (source, data) => template(source, opt)(data)
