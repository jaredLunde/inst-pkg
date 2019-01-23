const createPreset = require('@inst-app/create-preset')
const assign = createPreset.assign


const dependencies = {
  "@inst-app/babel-preset-inst": "^1.0.6",
  "@inst-app/cli": "^1.0.1-beta.31",
  "serverless": "^^1.36.1",
  "serverless-apigw-binary": "^0.4.4",
  "serverless-content-encoding": "^1.1.0",
  "serverless-domain-manager": "^2.6.10",
  "serverless-http": "^1.8.0",
  "serverless-plugin-lambda-warmup": "^1.0.1",
  "serverless-webpack": "^5.2.0",
}


createPreset.run(dependencies)
