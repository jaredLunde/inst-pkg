const createPreset = require('@inst-app/create-preset')
const assign = createPreset.assign


createPreset.run({
  "@inst-app/static-pwa": "^1.0.16",
  "apollo-boost": "^0.1.23",
  "apollo-link-context": "^1.0.12",
  "apollo-link-logger": "^1.2.3",
  "graphql": "^14.0.2",
  "graphql-tag.macro": "^2.0.0",
  "react-apollo": "^2.3.3",
  "set-cookie-parser": "^2.2.1"
})
