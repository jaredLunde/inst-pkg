# `@jaredlunde/react-preset`


`yarn add --dev @jaredlunde/babel-preset-inst`

```js
// .babelrc
{
  "env": {
    "cjs": {
      "presets": [
        ["@jaredlunde/inst", {
          "esx": {
            "env": {
              "useBuiltIns": "usage",
              "loose": true,
              "targets": "node"
            },
            "runtime": {"corejs": 2}
          },
          "react": {"transformConstant": false}
        }]
      ]
    }
  }
}
```
