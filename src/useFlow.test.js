import { useEffect } from 'react'
import useFlow from './useFlow'

describe('useFlow', () => {
  it('requires initialState to include all the properties', async () => {
    await mountHook(unmount => {
      const { actions } = useFlow({
        initialState: {},
        actions: ({ produceNewState }) => ({
          setUndocumentedProperty: () => {
            produceNewState(state => {
              state.undocumentedProperty = true
            })
          },
        }),
      })

      useEffect(() => {
        expect(() => {
          actions.setUndocumentedProperty()
        }).toThrowErrorMatchingInlineSnapshot(
          `"The initialState object must include all properties you intend to use."`
        )
        unmount()
      }, [])
    })
  })
})
