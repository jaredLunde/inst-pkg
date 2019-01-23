const createPreset = require('@inst-app/create-preset')
const assign = createPreset.assign
const BABEL_VERSION = '7.2.0'


const dependencies = {
  "@babel/runtime": BABEL_VERSION,
  "@babel/runtime-corejs2": BABEL_VERSION,
  "aws-sdk": "^2.382.0",
  "change-case": "^3.0.2",
  "cookie-parser": "^1.4.3",
  "cors": "^2.8.4",
  "csurf": "^1.9.0",
  "dotenv": "^6.2.0",
  "express": "^4.16.4"
}


createPreset.run(dependencies)
