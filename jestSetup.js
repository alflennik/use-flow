import testHook from './src/testHook/testHook'

global.testHook = testHook

let fetchCount = 0
global.fetch = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const imageLinks = ['/haulin.gif', '/paperairplanemill.gif', '/eatbacon.gif']
      const imageLink = imageLinks[fetchCount]
      fetchCount += 1
      if (fetchCount >= 3) fetchCount = 0
      resolve({
        text: async () => imageLink,
      })
    }, 30)
  })
}
