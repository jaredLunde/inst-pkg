import compile from './index'

test('variables', () => {
  const tpl = compile(`
    <:foo:>
    <:   bar   :>
  `)

  expect(tpl({foo: 'fish', bar: 'fosh'})).toMatchSnapshot()
})

test('conditional negation', () => {
  const tpl = compile(`
    <:if !!bar:>
      <:bar:>
    <:fi:>
  `)

  for (let bar of ['baz', null, void 0, false])
    expect(tpl({foo: bar === null && 'foo', bar})).toMatchSnapshot(String(bar))
})

test('conditional not', () => {
  const tpl = compile(`
    <:if bar:>
      <:bar:>
    <:elif foo:>
      <:foo:>
    <:else:>
      bar
    <:fi:>
  `)

  for (let bar of ['baz', null, void 0, false])
    expect(tpl({foo: bar === null && 'foo', bar})).toMatchSnapshot(String(bar))
})

test('conditional custom', () => {
  const tpl = compile(`
    <:if bar > 0:>
      <:bar:>
    <:else:>
      bar
    <:fi:>
  `)

  for (let bar of [0, 1]) expect(tpl({bar})).toMatchSnapshot(String(bar))
})

test('scripting', () => {
  const tpl = compile(`
    <:(
      if (vars.foo) {
        value += 'bar'
      }
      
      for (let i = 0; i < vars.bar.length; i++) {
        value += vars.bar[i] + '\\n'
      }
    ):>
  `)

  expect(tpl({foo: 1, bar: ['a', 'b', 'c', 'd']})).toMatchSnapshot('1')
  expect(tpl({foo: null, bar: ['a', 'b', 'c', 'd']})).toMatchSnapshot('null')
})

test('throws compilation error', () => {
  expect(() =>
    compile(`
    <:if foo:>
      <:foo:>
    <:fi>
  `)
  ).toThrowErrorMatchingSnapshot()
})
