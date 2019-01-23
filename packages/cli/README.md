- bin packaging with pkg
  - https://github.com/zeit/pkg/blob/master/package.json
- argument parsing w/ yargs
  - https://github.com/yargs/yargs
- file management
  - https://github.com/jprichardson/node-fs-extra
- user inputs
  - https://github.com/SBoudrias/Inquirer.js

Inputs:
  - [x] init
    - NAME
    - AUTHOR
    - REPO_URL
    - create /build
    - create /public
  - [ ] create-pwa
    - --inherits shared
    - NAME
    - AWS_DEV_PROFILE
    - AWS_PROD_PROFILE
    - STAGING_DOMAIN
    - PRODUCTION_DOMAIN
    - STAGING_BUCKET
    - PRODUCTION_BUCKET
    - INHERITS = --inherits || ~
    - find .radar or .static in pathname and include depending on type
    - if radar and no --inherits:
      - [ ] RADAR_DEV_DOMAIN
      - [ ] RADAR_STAGING_DOMAIN
      - [ ] RADAR_PRODUCTION_DOMAIN
  - [ ] create-shared
    - NAME
    - if radar:
      - RADAR_DEV_DOMAIN
      - RADAR_STAGING_DOMAIN
      - RADAR_PRODUCTION_DOMAIN
  - [ ] create-api
    - NAME
    - DEVELOPMENT_DOMAIN
    - STAGING_DOMAIN
    - PRODUCTION_DOMAIN


Additional Libs:
  - [x] @jaredlunde/curls-addons
  - [x] @jaredlunde/radar-addons
  - [x] @jaredlunde/react-delayed
  - [x] @jaredlunde/react-picture
  - [x] @jaredlunde/react-with-sticky
  - [x] @jaredlunde/react-form-field
  - [x] @jaredlunde/react-null
  - [x] react-wait-for

Presets:
  - [x] @jaredlunde/babel-preset-esx
  - [x] @jaredlunde/inst-build
    - [x] @jaredlunde/babel-preset-inst
  - [x] @jaredlunde/inst-radar-pwa
  - [x] @jaredlunde/inst-static-pwa
  - [x] @jaredlunde/inst-serverless-api
  - [x] @jaredlunde/inst-serverless-pwa
  - [x] @jaredlunde/webpack
  - [x] @jaredlunde/react
    - [x] @jaredlunde/babel-preset-react
  - [x] @jaredlunde/react-app
    - [x] @jaredlunde/babel-preset-react-app
