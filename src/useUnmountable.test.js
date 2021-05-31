import { useEffect, useCallback } from 'react'
import testHook from '../testHook/testHook'
import useUnmountable from './useUnmountable'

describe('useUnmountable', () => {
  it('unmounts promises in progress when the containing component unmounts', async () => {
    let resolveSomePromise

    const getSomePromise = () => {
      return new Promise(resolve => {
        resolveSomePromise = resolve
      })
    }

    const useUnmountableAsyncAction = unmountable => {
      const action = useCallback(async () => {
        await unmountable(getSomePromise())
        throw new Error('This should never execute')
      }, [])
      return action
    }

    await testHook(unmount => {
      const { unmountable, wrapAction } = useUnmountable()
      const action = useUnmountableAsyncAction(unmountable)
      const wrappedAction = wrapAction(action)

      useEffect(() => {
        wrappedAction()
        unmount()
      }, [])
    })

    expect(() => {
      resolveSomePromise()
    }).not.toThrow()
  })
})
