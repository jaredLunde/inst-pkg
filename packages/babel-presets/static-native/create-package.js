const createPreset = require('@inst-app/create-preset')
const assign = createPreset.assign


const dependencies = {
  "@emotion/primitives": "^9.2.11",
  "@render-props/utils": "^0.2.3",
  "curls-native": "^0.0.1-alpha.7",
  "prop-types": "^15.6.2",
  "react-router-native": "^4.3.0"
}


createPreset.run(dependencies)
