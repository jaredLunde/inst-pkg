const createPreset = require('@inst-app/create-preset')
const assign = createPreset.assign
const BABEL_VERSION = '^7.2.0'


const dependencies = {
  "@babel/runtime": BABEL_VERSION,
  "@babel/runtime-corejs2": BABEL_VERSION,
  "@inst-app/react": "^1.0.9",
  "history": "^4.7.2",
  "polished": "^2.3.1",
  "react-broker": "^1.0.9",
  "react-helmet": "^5.2.0",
  "react-router-dom": "^4.3.1",
  "curls": "^1.1.4"
}


createPreset.run(dependencies)
