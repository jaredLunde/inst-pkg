# inst-app
Instantly create serverless web and native applications for React with SSR
out of the box

### Installation
`npm i -g @inst-app/cli`

--------------------------------------------------------------------------------

## Documentation
- **inst-app**
  - `@inst-app/cli`
  - `@inst-app/basic-template`
  - `@inst-app/router`
  - `@inst-app/ssr`
  - `@inst-app/webpack`
  - **Presets**
    - `@inst-app/create-preset`
    - `@inst-app/babel-preset-esx`
    - `@inst-app/react`
    - `@inst-app/babel-preset-react`
    - `@inst-app/react-app`
    - `@inst-app/babel-preset-react-app`
    - `@inst-app/babel-preset-inst`
    - `@inst-app/webpack-deps`
    - `@inst-app/static-pwa`
    - `@inst-app/radar-pwa`
    - `@inst-app/serverless-pwa`
    - `@inst-app/serverless-api`

- **Monorepo**
  - node scripts
  - packages
  - assets
  - packages/public
- **Shared package**
  - src
- **PWA package**
  - config
  - src
  - node scripts
- **API package**
- **React Native package**

--------------------------------------------------------------------------------

### `@inst-app/cli`
### Projects
#### `inst init [project-name]`
#### `inst create-shared [name] [--cwd directory] [--static]`
#### `inst create-pwa [name] [--inherits shared-lib] [--cwd directory] [--static]`
#### `inst create-api [name] [--cwd directory]`
#### `inst create-native [name] [--inherits shared-lib] [--cwd directory] [--static]`

### PWAs
#### `inst start [port] [--ssr]`
#### `inst deploy [--prod|-p] [--init]`
#### `inst deploy-client [--prod|-p]`
#### `inst deploy-server [--prod|-p]`

--------------------------------------------------------------------------------

### `@inst-app/basic-template`
#### `template()`

--------------------------------------------------------------------------------

### `@inst-app/router`
#### `createRoute()`
#### `createRadarRoute()`

--------------------------------------------------------------------------------

### `@inst-app/ssr`
#### `createRenderer()`
#### `createRadarRenderer()`
#### `startDevRenderer()`
#### `lazy()`
#### `deployClient()`

--------------------------------------------------------------------------------

### `@inst-app/webpack`
#### `createConfig()`
#### `createDevelopment()`
#### `createProduction()`
#### `startDevServer()`

--------------------------------------------------------------------------------

### `@inst-app/create-preset`

--------------------------------------------------------------------------------

### `@inst-app/babel-preset-esx`

--------------------------------------------------------------------------------

### `@inst-app/react`

--------------------------------------------------------------------------------

### `@inst-app/babel-preset-react`

--------------------------------------------------------------------------------

### `@inst-app/react-app`

--------------------------------------------------------------------------------

### `@inst-app/babel-preset-react-app`

--------------------------------------------------------------------------------

### `@inst-app/babel-preset-inst`

--------------------------------------------------------------------------------

### `@inst-app/webpack-deps`

--------------------------------------------------------------------------------

### `@inst-app/static-pwa`

--------------------------------------------------------------------------------

### `@inst-app/radar-pwa`

--------------------------------------------------------------------------------

### `@inst-app/serverless-pwa`

--------------------------------------------------------------------------------

### `@inst-app/serverless-api`
