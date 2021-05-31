import { useRef, useState, useLayoutEffect, useMemo } from 'react'
import produce from 'immer'

const useFlow = ({ initialState, watched, actions: actionsConfig }) => {
  const [produceNewStateChangeCount, setProduceNewStateChangeCount] = useState(0)

  const watchedRef = useRef(watched)
  const stateRef = useRef(initialState)

  const getWatched = () => watchedRef.current
  const getState = () => stateRef.current

  useLayoutEffect(() => {
    watchedRef.current = watched
  })

  const setState = newState => {
    if (Object.keys(newState).length !== Object.keys(stateRef.current)) {
      throw new Error('The initialState object must include all properties you intend to use.')
    }
    stateRef.current = newState
    setProduceNewStateChangeCount(count => count + 1)
  }

  const produceNewState = stateProducer => {
    setState(produce(getState(), stateProducer))
  }

  // Enables nesting, i.e. actions.updateUser() can trigger actions.clearUser() via the argument
  const actions = {}
  const actionArguments = {
    getState,
    getWatched,
    produceNewState,
    actions,
  }
  const createdActions = actionsConfig(actionArguments)
  Object.keys(createdActions).forEach(key => {
    actions[key] = createdActions[key]
  })

  // Without memoization, both the state and actions would appear to have changed every time
  // a useFlow component or hook renders. See useCallback and useMemo docs for more information.
  const memoizedState = useMemo(() => stateRef.current, [produceNewStateChangeCount])
  const memoizedActions = useMemo(() => actions, [])

  return { state: memoizedState, actions: memoizedActions }
}

export default useFlow
