# useFlow

> Get into a flow state when using useFlow to manage state flows.™️

useFlow is a state management utility for React.

```js
const Counter = ({ minimumCount, maximumCount }) => {
  const {
    state: { count },
    actions: { increment, decrement },
  } = useFlow({
    initialState: { count: minimumCount },
    actions: Counter.actions,
    watched: { minimumCount, maximumCount },
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

`useFlow` returns an object containing immutable state and a set of functions with the sole power to change that state.

`initialState` is a self-documenting object containing all properties of the state.

`watched` contains props, callbacks or other data needed within the actions.

`actions` returns an object of functions that have the power to mutate the state, described below.

### **Actions**

```js
Counter.actions = ({ getWatched, getState, produceNewState, unmountable, actions }) => ({
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

`getWatched` returns the watched variables.

`getState` returns the state variables.

`produceNewState` accepts a function where the state can be mutated. This is the only way the state can be changed. It is powered by [Immer JS](https://immerjs.github.io/immer/docs/introduction).

`unmountable` allows you to stop execution when your components unmount (which causes React's memory leak warning), and it is [documented here](documentation/fixing-memory-leaks.md).

`actions` is an object containing all the actions. This allows actions to call other actions, leading to more organized code.

## You Might Need useFlow If...

- Your state from `useState` is stale and you have no idea how to fix it.
- `useCallback`, `useMemo` and `useReducer` are giving you a migrane when your task seems like it should be simple.
- You are resorting to hacks with `useRef`.
- Every component you write seems to suddenly drop memory leak warnings without warning.

## You Might Not Need useFlow If ...

- You are not experiencing the problems described above.
- Your component mostly consumes the data passed to it.
- You are flowing well with useState and do not need more than that.

useFlow really shines when:

- Your component or hook is highly asynchronous, like you would see in:
  - A modal counting down the number of seconds until the user's session has expired.
  - A global caching layer supporting invalidation when the user signs out.
- Your component or hook is highly event driven, like you would see in:
  - A notification component showing a stack of notifications that can be closed one by one.
  - A hook managing the ever-changing state of a form from key presses to validation errors and submission events.

## Benefits

A component or hook using useFlow will not need the more complex hooks like `useCallback`, `useMemo`, or `useReducer`, it won't need `useState` - which can get complicated when asynchronous state is involved - and it will remove most need for `useRef`. This is not to say those hooks are not worth knowing or using ... but often they feel like obstacles.

useFlow gives you a space to write reactive code, and it gives you a space, in the actions section, to write more traditional event-driven code.

When you have a mix of immutable reactivity and mutable actions - when both sides are really clicking and reinforcing each other - useFlow can feel like rocket fuel for your flow.

## Next Steps

- Install it!
  ```
  npm install --save use-flow-hook
  ```

  Or with Yarn:

  ```
  yarn add use-flow-hook
  ```

- [Try the tutorial](documentation/tutorial.md), which should take around an hour and walks you through the entire API, backwards and fowards, as you build a doggy viewer.
- [Read the tips.](documentation/tips.md)