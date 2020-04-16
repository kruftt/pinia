import { createStore, setActiveReq } from '../src'

describe('store.patch', () => {
  const useStore = () => {
    // create a new store
    setActiveReq({})
    return createStore({
      id: 'main',
      state: () => ({
        a: true,
        nested: {
          foo: 'foo',
          a: { b: 'string' },
        },
      }),
    })()
  }

  it('patches a property without touching the rest', () => {
    const store = useStore()
    store.patch({ a: false })
    expect(store.state).toEqual({
      a: false,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
    })
  })

  it('patches a nested property without touching the rest', () => {
    const store = useStore()
    store.patch({ nested: { foo: 'bar' } })
    expect(store.state).toEqual({
      a: true,
      nested: {
        foo: 'bar',
        a: { b: 'string' },
      },
    })
    store.patch({ nested: { a: { b: 'hello' } } })
    expect(store.state).toEqual({
      a: true,
      nested: {
        foo: 'bar',
        a: { b: 'hello' },
      },
    })
  })

  it('patches multiple properties at the same time', () => {
    const store = useStore()
    store.patch({ a: false, nested: { foo: 'hello' } })
    expect(store.state).toEqual({
      a: false,
      nested: {
        foo: 'hello',
        a: { b: 'string' },
      },
    })
  })

  it('caches old values', () => {
    const store = useStore()
    const spy = jest.fn()
    store.subscribe(spy)

    const patch = {
      nested: {
        foo: 'bar',
        a: { b: 0 },
      },
    }
    store.patch(patch)

    expect(spy).toHaveBeenCalledWith(
      {
        payload: patch,
        storeName: 'main',
        type: expect.stringContaining('patch'),
        oldValue: {
          nested: {
            foo: 'foo',
            a: { b: 'string' },
          },
        },
      },
      store.state
    )
  })
})
