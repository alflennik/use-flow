# Async State Flows with Use Flow

One of the most common React warnings is "Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application." This warning pops up anywhere you have async code, i.e. promises, mixed into your React components and hooks. 

You may have noticed the warning is inconsistent - it rarely appears in normal situations, but when you start testing your components or performing a less common interaction like logging out or partially refreshing the page, it suddently occurs.

Use Flow has a solution to this problem!

First, here is a simplified component which could produce the warning:

```js
useCurrentWeather(() => {
  const [weatherReport, setWeatherReport] = useState()

  useEffect(() => {
    fetch('https://example.com/api/weather')
      .then(response => response.text())
      .then(weather report => {
        setWeatherReport(weatherReport)
      })
    })
  })

  return weatherReport
})
```

The call to `setWeatherReport` will trigger the warning if its parent has unmounted before the fetch has completed. This is surprisingly easy to happen - clicking quickly through pages in your app could be enough to trigger it.

The official solution is to add a cleanup function to the useEffect, but many promises are not easily cancelable, fetch included, so solving this is going to be tricky.

Meanwhile, the most obvious solution, to [prevent state updates when the component has unmounted](https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html), has been called an antipattern by the React core team.

Use Flow provides a helper function called `unmountable` which will allow your async code to automatically abort when the hook unmounts.

```js
useCurrentWeather(() => {
  const { state, actions } = useFlow({
    initialState: { weatherReport: null },
    actions: useCurrentWeather.actions
  })

  useEffect(() => {
    actions.getWeatherReport()
  }, [])

  return state.weatherReport
})

useCurrentWeather.actions(({ produceNewState, unmountable }) => ({
  getWeatherReport: async () => {
    const weatherReport = await unmountable(
      fetch('https://example.com/api/weather')
        .then(response => response.text())
    )
    produceNewState(state => {
      state.weatherReport = weatherReport
    })
  }
}))
```

When a promise is wrapped in `unmountable` it will automatically abort when the hook unmounts, preventing any of the following code from ever executing.

This will immediately close the memory leak React is warning about - and the warning will no longer appear.

## Catching Errors

Under the hood unmountable throws an error to abort the current action. This does not prevent normal error handling, but there is one quirk to be aware of.

`.catch()` error handling is unaffected:

```js
const response = await unmountable(fetch(URL)).catch(error => {
  console.error(error)
})
```

But `try catch` error handling requires an additional line:

```js
let response
try {
  response = unmountable(fetch(URL))
} catch (error) {
  // This line must be added
  if (error.name === 'UseFlowUnmountError') throw error
  console.error(error)
}
```

The difference is due to the fact that `.catch()` can be wrapped by useFlow but `try catch` cannot.