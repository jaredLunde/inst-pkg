const createPreset = require('@inst-app/create-preset')
const assign = createPreset.assign
const REACT_VERSION = '^16.6.3'


const dependencies = {
  "invariant": "2.2.4",
  "prop-types": "^15.6.2",
  "react": REACT_VERSION,
  "react-display-name": "^0.2.4",
  "react-dom": REACT_VERSION
}


createPreset.run(dependencies)
