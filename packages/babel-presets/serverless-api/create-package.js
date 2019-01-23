const createPreset = require('@inst-app/create-preset')
const assign = createPreset.assign


const dependencies = {
  "@inst-app/babel-preset-inst": "^1.0.5",
  "@inst-app/cli": "^1.0.1-beta.23",
  "@inst-app/webpack": "^1.0.1",
  "serverless": "^1.36.1",
  "serverless-apigw-binary": "^0.4.4",
  "serverless-content-encoding": "^1.1.0",
  "serverless-domain-manager": "^2.6.10",
  "serverless-dotenv-plugin": "^2.0.1",
  "serverless-http": "^1.8.0",
  "serverless-offline": "^3.31.3",
  "serverless-plugin-lambda-warmup": "^1.0.1",
  "serverless-webpack": "^5.2.0"
}


createPreset.run(dependencies)
