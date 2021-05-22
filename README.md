# Use Flow

> Get into a flow state when using useFlow to manage state flows.™️

```js
const Counter = ({ minimumCount, maximumCount }) => {
  const {
    state: { count },
    actions: { increment, decrement },
  } = useFlow({
    initialState: { count: minimumCount },
    actions: Counter.actions,
    watch: { minimumCount, maximumCount },
  })

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

`useFlow` returns an object containing immutable state and a set of functions with the power to change that state.

`initialState` is a self-documenting object containing all properties of the state. You cannot add additional properties later.

`watch` contains props, callbacks or other data needed within the actions. You cannot add additional properties later.

`actions` returns an object of functions that have the power to mutate the state, described below.

### **Actions**

```js
Counter.actions = ({ getWatched, getState, produceNewState, actions }) => ({
  increment: () => {
    const { maximumCount } = getWatched()
    const { count } = getState()
    produceNewState(state => {
      state.count = 
        count >= maximumCount 
          ? maximumCount
          : count + 1
    })
  },

  decrement: () => {
    const { minimumCount } = getWatched()
    const { count } = getState()
    produceNewState(state => {
      state.count = 
        count <= minimumCount 
          ? minimumCount
          : count - 1
    })
  }
})
```

`getWatched` returns the watch variables.

`getState` returns the state variables.

`produceNewState` accepts a function where the state can be mutated. This is the only way the state can be changed. It is powered by [Immer JS](https://immerjs.github.io/immer/docs/introduction).

`actions` is an object containing all the actions. This allows actions to call other actions, leading to more organized code.
