// v1.0.6 // 10/1/2018 //

function req(plugin) {
  var module = require(plugin)
  return module.default || module
}

function isPlainObject(o) {
  if (o !== null && typeof o === 'object') {
    var proto = Object.getPrototypeOf(o)
    return proto === Object.prototype || proto === null
  }

  return false
}

function deepAssign() {
  var head = arguments[0]
  var objects = Array.prototype.slice.call(arguments, 1)

  for (var i = 0; i < objects.length; i++) {
    var next = objects[i]

    for (var key in next) {
      var nextObj = next[key]

      if (isPlainObject(nextObj) && isPlainObject(head[key])) {
        head[key] = deepAssign(head[key], nextObj)
      } else {
        head[key] = nextObj
      }
    }
  }

  return head
}

module.exports = function(api, opt) {
  var env = process.env.NODE_ENV

  if (env === 'production') {
    return {
      presets: [
        [
          req('@inst-app/babel-preset-esx'),
          deepAssign(
            {
              env: {useBuiltIns: 'usage', loose: true, modules: false},
              runtime: {corejs: 2},
            },
            opt.esx,
          ),
        ],
        [
          req('@inst-app/babel-preset-react-app'),
          deepAssign({react: {transformConstant: false}}, opt.app),
        ],
      ],

      plugins: [],
    }
  } else {
    return {
      presets: [
        [
          req('@inst-app/babel-preset-esx'),
          deepAssign(
            {
              env: {useBuiltIns: 'usage', loose: true, modules: false},
              runtime: {corejs: 2},
            },
            opt.esx,
          ),
        ],
        [
          req('@inst-app/babel-preset-react-app'),
          deepAssign({react: {transformConstant: false}}, opt.app),
        ],
      ],

      plugins: [],
    }
  }
}
