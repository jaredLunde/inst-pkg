const createPreset = require('@inst-app/create-preset')
const assign = createPreset.assign
const extendProd = createPreset.extendProd


const dependencies = {}
dependencies.development = {
  "@inst-app/babel-preset-react": {
    "version": "^1.0.3",
    isBabelPreset: true,
    options: assign({}, 'react')
  },
  "babel-plugin-emotion": {
    "version": "^9.2.11",
    isBabelPlugin: true,
    options: assign({"sourceMap": true}, 'emotion')
  },
  "babel-plugin-polished": {
    "version": "^1.1.0",
    isBabelPlugin: true,
  }
}

extendProd(dependencies, {
  "babel-plugin-emotion": {
    options: assign({"sourceMap": false, "hoist": true}, 'emotion')
  }
})


createPreset.run(dependencies)
