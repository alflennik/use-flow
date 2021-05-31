import { useLayoutEffect, useRef, useCallback } from 'react'

class UseFlowUnmountError extends Error {
  constructor() {
    super()
    this.name = 'UseFlowUnmountError'
  }
}

const useUnmountable = () => {
  const isMounted = useRef(true)

  useLayoutEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const unmountable = useCallback(promise => {
    const wrappedPromise = promise.then(result => {
      if (!isMounted.current) throw new UseFlowUnmountError()
      return result
    })

    wrappedPromise.originalCatch = wrappedPromise.catch
    wrappedPromise.catch = errorHandler => {
      return wrappedPromise.originalCatch(error => {
        if (error.name === 'UseFlowUnmountError') throw error
        return errorHandler(error)
      })
    }

    return wrappedPromise
  }, [])

  const wrapAction = action => {
    return (...args) => {
      const response = action(...args)
      if (!(response && response.catch)) return response

      response.catch(error => {
        if (error.name === 'UseFlowUnmountError') return
        throw error
      })

      return response
    }
  }

  return { unmountable, wrapAction }
}

export default useUnmountable
