const createPreset = require('@inst-app/create-preset')
const assign = createPreset.assign


const dependencies = {
  "babel-loader": "^8.0.4",
  "cross-env": "^5.2.0",
  "json-loader": "^0.5.7",
  "lodash-es": "^4.17.10",
  "file-loader": "^3.0.1",
  "ignore-emit-webpack-plugin": "^1.0.2",
  "imagemin-jpegtran": "^6.0.0",
  "imagemin-mozjpeg": "^8.0.0",
  "imagemin-optipng": "^6.0.0",
  "imagemin-webpack": "^4.0.1",
  "offline-plugin": "^5.0.6",
  "raw-loader": "^1.0.0",
  "responsive-loader": "^1.2.0",
  "sharp": "^0.21.1",
  "stats-writer-webpack-plugin": "^1.2.0",
  "terser-webpack-plugin": "^1.2.0",
  "webpack": "^4.28.2",
  "webpack-bundle-analyzer": "^3.0.3",
  "webpack-cli": "^3.1.2",
  "webpack-dev-server": "^3.1.14",
  "webpack-hot-middleware": "^2.24.3",
  "webpack-hot-server-middleware": "^0.5.0",
  "webpack-jarvis": "^0.3.2",
  "webpack-merge": "^4.1.5",
  "webpack-node-externals": "^1.7.2",
  "workerize-loader": "^1.0.4",
  "write-file-webpack-plugin": "^4.5.0"
}


createPreset.run(dependencies)
