const createPreset = require('@inst-app/create-preset')
const assign = createPreset.assign
const BABEL_VERSION = createPreset.constants.BABEL_VERSION

/**
apollo-server
graphql
*/
createPreset.run({
  "@babel/runtime": '^7.2.0',
  "@babel/runtime-corejs2": '^7.2.0',
  "apollo-server": "^2.3.1",
  "aws-sdk": "^2.382.0",
  "change-case": "^3.0.2",
  "cookie-parser": "^1.4.3",
  "csurf": "^1.9.0",
  "dotenv": "^6.2.0",
  "express": "^4.16.4",
  "graphql": "^14.0.2",
  "graphql-fields": "^2.0.1",
  "graphql-tag.macro": "^2.0.0"
})
