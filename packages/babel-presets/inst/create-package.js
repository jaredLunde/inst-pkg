const createPreset = require('@inst-app/create-preset')
const deepAssign = createPreset.deepAssign


const dependencies = {}
dependencies.development = {
  "@inst-app/babel-preset-esx": {
    version: "^1.0.5",
    isBabelPreset: true,
    options: deepAssign(
      {
        env: {
          "useBuiltIns": "usage",
          "loose": true,
          "modules": false
        },
        "runtime": {corejs: 2}
      },
      'esx'
    )
  },
  "@inst-app/babel-preset-react-app": {
    version: "^1.0.5",
    isBabelPreset: true,
    options: deepAssign(
      {
        react: {transformConstant: false}
      },
      'app'
    )
  }
}

dependencies.production = dependencies.development


createPreset.run(dependencies)
