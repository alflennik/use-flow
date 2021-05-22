import React from 'react'
import ReactDom from 'react-dom'
import useFlow from '../useFlow'

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

Counter.actions = ({ getWatched, getState, produceNewState, actions }) => ({
  increment: () => {
    const { maximumCount } = getWatched()
    const { count } = getState()
    produceNewState(state => {
      state.count = count >= maximumCount ? maximumCount : count + 1
    })
  },

  decrement: () => {
    const { minimumCount } = getWatched()
    const { count } = getState()
    produceNewState(state => {
      state.count = count <= minimumCount ? minimumCount : count - 1
    })
  },
})

const TestPage = () => {
  return <Counter minimumCount={1} maximumCount={5} />
}

ReactDom.render(<TestPage />, document.getElementById('test-page'))
