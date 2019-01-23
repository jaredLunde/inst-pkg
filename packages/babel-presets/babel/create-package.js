const createPreset = require('@inst-app/create-preset')
const assign = createPreset.assign
const BABEL_VERSION = '^7.2.3'


const dependencies = {}
dependencies.development = {
  "@babel/preset-env": {
    version: BABEL_VERSION,
    options: assign({loose: true}, 'env'),
    isOptional: 'env',
    isBabelPreset: true
  },
  "@babel/cli": {
    version: BABEL_VERSION
  },
  "@babel/core": {
    version: '^7.2.2'
  },
  "@babel/plugin-transform-runtime": {
    version: '^7.2.0',
    options: assign({}, 'runtime'),
    isOptional: 'runtime',
    isBabelPlugin: true
  },
  "@babel/plugin-proposal-class-properties": {
    version: BABEL_VERSION,
    options: assign({loose: true}, 'classProps'),
    isBabelPlugin: true
  },
  "@babel/plugin-proposal-export-default-from": {
    version: '^7.2.0',
    isBabelPlugin: true
  },
  "@babel/plugin-proposal-export-namespace-from": {
    version: '^7.2.0',
    isBabelPlugin: true
  },
  "@babel/plugin-proposal-logical-assignment-operators": {
    version: '^7.2.0',
    isBabelPlugin: true
  },
  "@babel/plugin-proposal-nullish-coalescing-operator": {
    version: '^7.2.0',
    isBabelPlugin: true
  },
  "@babel/plugin-transform-object-assign": {
    version: '^7.2.0',
    isBabelPlugin: true
  },
  "@babel/plugin-proposal-object-rest-spread": {
    version: '^7.2.0',
    isBabelPlugin: true
  },
  "@babel/plugin-proposal-optional-chaining": {
    version: '^7.2.0',
    isBabelPlugin: true
  },
  "@babel/plugin-syntax-dynamic-import": {
    version: '^7.2.0',
    isBabelPlugin: true
  },
  "@babel/plugin-syntax-import-meta": {
    version: '^7.2.0',
    isBabelPlugin: true
  },
  "babel-plugin-closure-elimination": {
    version: "^1.3.0",
    isBabelPlugin: true
  },
  "babel-plugin-macros": {
    version: "^2.4.3",
    isOptional: 'macros',
    isBabelPlugin: true
  },
  "babel-plugin-dev-expression": {
    "version": "^0.2.1",
    isBabelPlugin: true
  },
  "cross-env": {
    version: "^5.2.0"
  }
}
dependencies.production = dependencies.development


createPreset.run(dependencies)
