INST 2.0

The sooner, the better

Inst is:
- Templating

Inst has built-in templates for:
- Webpack
- Babel
- Serverless Framework
- AWS


TODO:
- NPM packages as templates?
    - `inst add [package-name] @stellar-apps/inst-react-app`
    - `inst add [package-name] @stellar-apps/inst-react-apollo-app`
    - `inst add [package-name] @stellar-apps/inst-core`
- Git repos as templates?
    - `inst add [packageName] https://github.com/jaredlunde/inst-react-app`
- Local paths as templatees?
    - `inst add [packageName] path:../to/somewhere`
- Can stack templates?
    - `inst add [packageName] path:../to/somewhere @stellar-apps/inst-react-app`
- Define clear API for JS config `inst.config.js`
- Extensible templating questions


`inst template [template-name]`
`inst add [package-name] [NPM/git template] (e.g. core)`
`inst init [monorepo name]`
  `inst init jared-lunde`
`cd jared-lunde`

`yarn inst add core @stellar-apps/core`
`yarn inst add app @stellar-apps/inst-react-app`
`yarn inst add app @stellar-apps/inst-react-apollo-app`
`yarn inst add basic-api @stellar-apps/inst-fetch-api`
`yarn inst add graphql-api @stellar-apps/inst-apollo-api`
