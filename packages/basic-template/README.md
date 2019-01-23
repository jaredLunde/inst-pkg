# @jaredlunde/basic-template

A blazing fast(tm) template engine with just properties and conditionals out of
the box


```js
let t = compile('hello, {% name %} {? sayMyLastName ?}{% lastName %}{??}')
t({name: 'jared', lastName: 'lunde'})
t({name: 'jared', lastName: 'lunde', sayMyLastName: true})

let t = compile(`
  hello, {% name %}
  {? sayMyLastName > 1 ?}
    {% lastName %}
  {??}
`)
t({name: 'jared', lastName: 'lunde', sayMyLastName: 0})
t({name: 'jared', lastName: 'lunde', sayMyLastName: 2})
```
