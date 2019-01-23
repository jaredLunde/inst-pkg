const createPreset = require('@inst-app/create-preset')
const assign = createPreset.assign


const dependencies = {
  "@inst-app/router": "^1.0.4",
  "@inst-app/basic-template": "^1.0.0",
  "@inst-app/ssr": "^1.0.1-beta.31",
  "@jaredlunde/curls-addons": "^2.1.0",
  "@render-props/utils": "^0.2.3",
  "emotion-server": "^9.2.4",
  "find-package-json": "^1.1.0",
  "js-cookie": "^2.2.0",
  "node-fetch": "^2.2.0",
  "unfetch": "^4.0.1",
  "resolve-url": "^0.2.1"
}


createPreset.run(dependencies)
