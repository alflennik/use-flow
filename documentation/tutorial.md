# useFlow Tutorial

This tutorial, which I think it will take at least an hour, demonstrates how you can use useFlow to tackle some real engineering challenges - challenges that would be quite difficult to fully solve with vanilla hooks! - as you build a cute little doggy viewer. And it uses every API useFlow has to offer, so you'll be an expert by the end.

## Requirements

You'll need some basic JavaScript and React knowledge, you'll need Node installed and a terminal, but I will try my best to make sure it isn't too intimidating to the relative newcomers out there.

## Off We Go!

In a terminal navigate to the folder within which you want to create the tutorial project:

```
cd ~/Projects
```

Run the command from [Create React App](https://reactjs.org/docs/create-a-new-react-app.html) that will create a use-flow-tutorial folder.

```
npx create-react-app use-flow-tutorial
```

Enter the folder.

```
cd use-flow-tutorial
```

Start Create React App!

```
npm start
```

At this point, you should see the React start page in your browser.

Open the tutorial folder in your code editor. If you are using VSCode, you can try running this command (in a second terminal window) to view the code:

```
code .
```

If your terminal says the code command is not found, [this article](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line) might help.

In the code editor, take a look around. 

To get started, let's install useFlow. Run the command in a second terminal window.

```
npm install --save use-flow-hook
```

In the code editor, look for the snippet below, which is in `App.jsx`:

```js
Edit <code>src/App.js</code> and save to reload.
```

Delete everything inside the `div`, leaving just this:

```js
    <div className="App">
    </div>
```

If you peek over at your browser, you'll now see a blank white page. A blank canvas!

Create a new file in the src folder called `Doggy.jsx`.

Now take a look at this [list of free APIs](https://mixedanalytics.com/blog/list-actually-free-open-no-auth-needed-apis/). The one we're interested in is the [dog api](https://dog.ceo/dog-api/).

You can see on the dog api homepage what the API output looks like. You should see something like this:

```json
{
    "message": "https://images.dog.ceo/breeds/terrier-patterdale/Patterdale.jpg",
    "status": "success"
}
```

The message part is what we're interested in - this image is what we are going to display in our tutorial, along with the capability to keep loading more images.

But before we get ahead of ourselves, let's take a second to just make sure we can show an image before we get all fancy with API requests.

In `Doggy.jsx`, let's create a simple component that show the image linked above.

```js
import React from "react";

const Doggy = () => {
  const doggyUrl = 'https://images.dog.ceo/breeds/terrier-patterdale/Patterdale.jpg'
  return <img src={doggyUrl} />
}

export default Doggy
```

Of course this component isn't used anywhere, so it won't appear on the page yet. Let's remedy that.

```diff
import React from "react";
+import Doggy from "./Doggy";

function App() {
  return (
-   <div className="App"></div>
+   <div className="App">
+     <Doggy />
+   </div>
  );
}

export default App;
```

Now, if all has gone well, you should see an image of a dog in your browser!

Let's return to `Doggy.jsx`.

One best practice that I want to highlight right now - and this has become doubly important to me as I've contributed to improving assistive technologies in my day job - is the need to make images accessible.

In this case, that means alt text. Typically, the guidelines for alt text go something like this:

- Don't use the word "picture" or "image" because that is already clear from the context on the page.
- Write your copy to describe both the image and the way it's being used within the page.
- Remember to capture the emotional content of the image, not just the literal content.

The challenge here is that we have no way to get alt text for every single image in the database. But that shouldn't stop us from describing the function of the image in the page.

I came up with something like this:

```js
<img
  src={doggyUrl}
  alt="Random dog from the free and open source dog.ceo/dog-api database."
/>
```

Most of the bones are in place now, and I am itching to design the internal data structure for our Doggy component. But before we jump into that, let's write out all the boilerplate needed for useFlow to work.

TODO: explain state and actions in general.

```js
import React from "react";
import useFlow from "use-flow-hook";

const Doggy = () => {
  const {
    state: {},
    actions: {},
  } = useFlow({
    initialState: {},
    actions: Doggy.actions,
  });

  return (
    <img
      src={doggyUrl}
      alt="Random dog from the free and open source dog.ceo/dog-api database."
    />
  )
};

Doggy.actions = () => ({});

export default Doggy;
```

Let's just go through this quickly! 

- ```js
  import useFlow from "use-flow-hook";
  ``` 
  This snippet makes useFlow available in this file.
- ```js
  const {
    state: {},
    actions: {}
  } = useFlow({
  ```
  This snippet uses destructuring to pull out the state and actions from useFlow. Currently there is nothing there, which just means our component does nothing.

  But even when we do start adding state and actions here, I want to note that the list does not be comprehensive, and it will only include state or actions which are needed within the React component. Since this is hard to explain without examples, just know there will be more on this later.
- ```js
  initialState: {},
  ```
  The `initialState` is where we will list all the state we will need to keep track of inside useFlow. This object _must_ include all the state we plan on using. In fact, if you try to create some state that isn't listed here, useFlow will throw an error! This requirement gives us confidence that all the state we are using is fully documented in one place. This makes it a "self documenting" feature.
- ```js
  actions: Doggy.actions,
  ``` 
  This snippet tells useFlow where to find our actions.
  
  It may look a little strange. We've written it like this to make it easier to put the actions at the bottom of the file. You might be wondering if we could assign the actions to a variable and put it at the top of the file. If you were wondering that you are correct! Also, it would be perfectly fine to define the actions right there inside the component. Since the actions tend to get fairly long, I think a good convention is to put them at the bottom of the file like I have here.
- ```js
  Doggy.actions = () => ({})
  ```
  This is where we define the actions. It looks quite strange now without any actions defined, but as we add actions it will become a lot easier to read.

  What it means is: `Doggy.actions` is a function, and that function returns an object.

With the boilerplate on the page, we can now focus on the task at hand: figuring out how to pull a URL for a dog image from the dog.ceo API and stick it into the `img` tag.

Therefore, I think the state we will need is:

- `doggyUrl`: this will be a string storing the URL we get from the API. It can also be `null` while our request is still in progress.

And the action we will need is:

- `fetchDoggy`: this is a async function with no arguments. I know it will be async because it will make a network request. It also will not return anything. Instead, when it completes it will set the `doggyUrl`.

Let's add our state and actions now:

```diff
const Doggy = () => {
  const {
-   state: {},
+   state: { doggyUrl },
-   actions: {},
+   actions: { fetchDoggy },
  } = useFlow({
-   initialState: {}
+   initialState: {
+     doggyUrl: null,
+   },
    actions: Doggy.actions,
  });

  return (
    <img
      src={doggyUrl}
      alt="Random dog from the free and open source dog.ceo/dog-api database."
    />
  )
};

-Doggy.actions = () => ({})
+Doggy.actions = () => ({
+ fetchDoggy: async () => {},
+});
```

Now it's time to actually start implementing our component. We will use the Fetch API to fetch an image URL:

```diff
useDoggy.actions = () => ({
- fetchDoggy: async () => {},
+ fetchDoggy: async () => {
+   const rawResponse = await fetch("https://dog.ceo/api/breeds/image/random");
+   const { message: doggyUrl } = await rawResponse.json();
+ },
});
```

This is much closer, but we have still not set the `doggyUrl`! `const { message: doggyUrl }` simply sets a variable within the action, but this is not the same as setting the state within useFlow.

By the way, I decided to rename `message` to `doggyUrl` because I felt that message was misleadingly generic sounding.

Now let's set the state within useFlow. For this, we will use the `produceNewState` helper function.

```diff
-useDoggy.actions = () => ({
+useDoggy.actions = ({ produceNewState }) => ({
  fetchDoggy: async () => {
    const rawResponse = await fetch("https://dog.ceo/api/breeds/image/random");
    const { message: doggyUrl } = await rawResponse.json();
+   produceNewState((state) => {
+     state.doggyUrl = doggyUrl;
+   });
  },
});
```

Let's recap these changes quickly.

- ```js
  ({ produceNewState }) => ({
  ```

  This the first helper function we've used. Throughout this tutorial we will eventually use all five of the helpers (`produceNewState`, `getState`, `actions`, `unmountable`, `getWatched`). The presence of helpers is the reason `Doggy.actions` needs to be a function that returns an object instead of just an object.
- ```js
  produceNewState((state) => {
    state.doggyUrl = doggyUrl;
  });
  ```
  This snippet sets the `doggyUrl` within useFlow.

  You might be wondering why this helper is called `produceNewState` instead of something like `setState`. This is because useFlow uses the `produce` API provided by Immer JS, a library that makes it easy to manipulate immutable data.

  Talking about it another way, changing state this way guarantees that the state can only be changed inside a `produceNewState` callback function.

  The `state` passed has the same properties as the `initialState` we already defined.

  You don't need to return anything from this function - Immer will detect all the changes you made to state within the callback and apply them.

  This approach is less error-prone than other methods of handling immutable data, such as the React's setState or Redux's reducers, where you need to carefully avoid methods like `array.push()` which mutate the array. With `produceNewState`, you can simply use `array.push()`!

  If not all of that makes sense, don't worry, you'll see lots more examples of updating state later in this tutorial.

We've made some great progress, but you may have noticed that the React app is still showing a blank white page. Why?

Well, the reason is that we haven't started the request. If the `fetchDoggy` action is never triggered, our `doggyUrl` will never populate.

The approach we'll use is the same as the approach we'd use in any React hook or component, we'll use React's `useEffect`.

```diff
-import React from "react";
+import React, { useEffect } from "react";
import useFlow from "use-flow-hook";
```
```diff
    actions: Doggy.actions,
  });

+ useEffect(() => {
+   fetchDoggy();
+ }, []);
+
  return (
    <img
      src={doggyUrl}
      alt="Random dog from the free and open source dog.ceo/dog-api database."
    />
  )
};
```

`useEffect` is a bread-and-butter hook in React for triggering any side effects and running code that shouldn't run on every render.

Depending on your text editor, you may have already seen a warning appear on the `[]` part of `useEffect`, and the warning is asking you to add `fetchDoggy` to the dependency array.

Just like that, you've been plunged into a debate over how to think about `useEffect` and how to introduce it to newcomers.

The reason the warning appears is because Create React App comes with many linting rules, powered by ESLint, turned on by default.

Now, you could add `fetchDoggy` to the dependency array and it would work perfectly fine, but instead of doing that, for this tutorial I'm going to have us turn this rule off. 

I think a sidebar is needed here to explain. So how does the dependency array of `useEffect` actually work?

Probably the reason this is confusing is that the dependency array has two functions:

1) Tell React when you want your effect to run. In this case, once when the component mounts.
2) Prevent stale data from making its way into the component.

Stale data can cause horrible bugs which require extended debugging sessions to catch and much longer to really understand how and why it's happening. And it's reason number 2 that the React team has turned on the rule.

In fact, the rule basically requires us to use the dependency array to handle problem number 2 only, and it encourages us to solve problem number 1 in other ways.

But as you can see in the [React guide for this situation](https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies), the rule doesn't prevent problem 2 from occurring, it just helps make it less likely to happen.

Now I'd like to direct your attention to an interesting note in that guide:

> The identity of the setCount function is guaranteed to be stable so it’s safe to omit.

This is referring to the fact that the setter function returned by `useState` doesn't need to be included in the dependency array.

This is where useFlow comes in to help. When using useFlow, you need to remember two rules:

1. Actions are safe to use in effects for the same reason useState setter functions are safe. _And any state inside the action_ is safe.

2. State is not safe to use in effects unless they are included in the dependency array. Again, this does not apply to state used inside the action.

The real reason useFlow makes effects much less painful is that it helps you keep your effect extremely small. It allows you to use your effects to trigger useFlow actions, and useFlow actions are immune from stale data.

So let's turn off that rule:

```diff
+ /* eslint-disable react-hooks/exhaustive-deps */
  import React, { useEffect } from "react";
  import useFlow from "use-flow-hook";

  const Doggy = () => {
```

The good news is that a dog has appeared on the page! The bad news is that, when you refresh the page, there is a broken image flashing there for a moment.

Before we celebrate, let's fix that. The problem is that `doggyUrl` can be `null`, and an `img` with a `null` `src` is a broken image.

The solution is to return `null` from the component while it's waiting for data.

```diff
  useEffect(() => {
    fetchDoggy();
  }, []);

+ if (!doggyUrl) return null
+

  return (
    <img
      src={doggyUrl}
      alt="Random dog from the free and open source dog.ceo/dog-api database."
    />
  )
```

A little celebration is in order! But we can improve it even more:

```diff
  return (
    <img
+     onClick={fetchDoggy}
      src={doggyUrl}
      alt="Random dog from the free and open source dog.ceo/dog-api database."
    />
  )
```

This change allows us to load more pictures just by clicking.

However, I am noticing that the fact you can click the image is not that obvious. Let's make the cursor change when you mouse over the image:

```diff
  return (
    <img
+     style={{ cursor: "pointer" }}
      onClick={fetchDoggy}
      src={doggyUrl}
      alt="Random dog from the free and open source dog.ceo/dog-api database."
    />
  )
```

So far so good! We've set up a doggy viewer component, and if you're anything like me, you've just spent several minutes looking at doggies.

As is frequently the case with useFlow, things have gone so smoothly that I feel a temptation - no, a _need_ - to elevate the experience. If it's so easy to do, why not!

So let's optimize the performance of our app, which will be a great opportunity to take our tutorial from the simpler situation we've handled so far into something at the complexity-level of a real-world application and see how useFlow handles it.

preloading

https://stackoverflow.com/questions/3646036/preloading-images-with-javascript

```diff
Doggy.actions = ({ produceNewState }) => ({
  fetchDoggy: async () => {
    const rawResponse = await fetch("https://dog.ceo/api/breeds/image/random");
    const { message: doggyUrl } = await rawResponse.json();
    produceNewState((state) => {
      state.doggyUrl = doggyUrl;
    });
  },
+
+ preloadImage: (url) => {
+   var img = new Image();
+   img.src = url;
+ },
});
```

- We're not quite ready yet to call preloadImage
- We will need to revisit fetchDoggy
- When we get a url, we should immediately fetch another url and preload it.
- This means there are actually two parts

```diff
  const {
    state: { doggyUrl },
    actions: { fetchDoggy },
  } = useFlow({
    initialState: {
      doggyUrl: null,
+     nextDoggyUrl: null,
    },
    actions: useDoggy.actions,
  });
```

nextDoggyUrl

Now making more sense
- When the app calls fetchNextDoggy, it should return the nextDoggyUrl.

So fetchDoggy will immediately change the nextDoggyUrl to the doggyUrl and then start fetching a new nextDoggyUrl.

we need to create a new fetchDoggy function, and rename the current fetchDoggy function.

Let's call it loadImageUrl

Now we can create another fetchDoggy function that uses preloadImage and loadImageUrl

```diff
-useDoggy.actions = ({ produceNewState }) => ({
+useDoggy.actions = ({ getState, produceNewState, actions }) => ({
+ fetchDoggy: async () => {},
+
- fetchDoggy: async () => {
+ loadImageUrl: async () => {
    const rawResponse = await fetch("https://dog.ceo/api/breeds/image/random");
    const { message: doggyUrl } = await rawResponse.json();
    return doggyUrl;
  },

  preloadImage: (url) => {
    var img = new Image();
    img.src = url;
  },
});
```

explain actions, getState

```js
  // Attempt 1 ... incomplete
  fetchDoggy: async () => {
    const { doggyUrl, nextDoggyUrl } = getState();
    produceNewState(state => {
      state.doggyUrl = nextDoggyUrl;
    });
 
    const preloadDoggyUrl = await actions.loadImageUrl();
    produceNewState(state => {
      state.nextDoggyUrl = preloadDoggyUrl;
    });
  },
```

It's still not quite right
doggyUrl is unused
both doggyUrl and nextDoggyUrl might be null

```js
  // Attempt 2 ... incomplete
  fetchDoggy: async () => {
    const { doggyUrl, nextDoggyUrl } = getState();

    const isFirstLoad = !doggyUrl;
    if (isFirstLoad) {
      const firstDoggyUrl = await actions.loadImageUrl();
      produceNewState((state) => {
        state.doggyUrl = firstDoggyUrl;
      });
    } else {
      produceNewState((state) => {
        state.doggyUrl = nextDoggyUrl;
        state.nextDoggyUrl = null;
      });
    }

    const preloadDoggyUrl = await actions.loadImageUrl();
    produceNewState((state) => {
      state.nextDoggyUrl = preloadDoggyUrl;
    });
  },
```

Now I'm reading through this a couple of times.

isFirstLoad, by the way

The first time through, it will call loadImageUrl twice. Every other time it will call it once.

This seems like it might work.

I ran it, and it's still working, but when I looked in the network tab, I was expecting to see the next image being loaded in advance, but it wasn't.

I looked at the code one more time, and I realized - I haven't called preloadImage!

```diff
    const preloadDoggyUrl = await actions.loadImageUrl();
+   actions.preloadImage(preloadDoggyUrl);
    produceNewState((state) => {
      state.nextDoggyUrl = preloadDoggyUrl;
    });
  },
```

after a page refresh, I saw what I expected, an extra image was appearing in the network tab... and the image loading was now instantaneous.

now the time for stress testing. Naturally I click as fast as I could - and to my surprise, the doggy disappeared! There's a bug. But why?

I realized that strange behavior might occur if you call fetchDoggy rapidly. If two fetchDoggy calls run at the same time, the line doggyUrl = nextDoggyUrl would set doggyUrl to null if nextDoggyUrl hadn't finished loading.

The solution is to make sure fetchDoggy will return early if another instance is already working.

```diff
  fetchDoggy: async () => {
    const { doggyUrl, nextDoggyUrl } = getState();

+   const anotherFetchInProgress = doggyUrl && !nextDoggyUrl;
+   if (anotherFetchInProgress) {
+     return;
+   }
+
    const isFirstLoad = !doggyUrl;
```

```js
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import useFlow from "use-flow-hook";

const Doggy = ({ paid }) => {
  const {
    state: { doggyUrl },
    actions: { fetchDoggy },
  } = useFlow({
    initialState: {
      doggyUrl: null,
      nextDoggyUrl: null,
    },
    actions: Doggy.actions,
    watched: { paid },
  });

  useEffect(() => {
    fetchDoggy();
  }, []);

  if (!doggyUrl) return null;

  return (
    <img
      style={{ cursor: "pointer" }}
      onClick={fetchDoggy}
      src={doggyUrl}
      alt="Random dog from the free and open source dog.ceo/dog-api database."
    />
  );
};

Doggy.actions = ({ getState, produceNewState, actions }) => ({
  fetchDoggy: async () => {
    const { doggyUrl, nextDoggyUrl } = getState();

    const anotherFetchInProgress = doggyUrl && !nextDoggyUrl;
    if (anotherFetchInProgress) {
      return;
    }

    const isFirstLoad = !doggyUrl;
    if (isFirstLoad) {
      const firstDoggyUrl = await actions.loadImageUrl();
      produceNewState((state) => {
        state.doggyUrl = firstDoggyUrl;
      });
    } else {
      produceNewState((state) => {
        state.doggyUrl = nextDoggyUrl;
        state.nextDoggyUrl = null;
      });
    }

    const anotherDoggyUrl = await actions.loadImageUrl();
    actions.preloadImage(anotherDoggyUrl);
    produceNewState((state) => {
      state.nextDoggyUrl = anotherDoggyUrl;
    });
  },

  loadImageUrl: async () => {
    const rawResponse = await fetch("https://dog.ceo/api/breeds/image/random");
    const { message: doggyUrl } = await rawResponse.json();
    return doggyUrl;
  },

  preloadImage: (url) => {
    var img = new Image();
    img.src = url;
  },
});

export default Doggy;
```

If that code seems difficult to write, that's because it was. This is a tricky feature to implement, in any app.

Reflect on writing this without useFlow

But we're not done, because there is still a bug waiting to be discovered. To illustrate, let's introduce a new feature - a doggy limit. When more than three doggies have been viewed, the app will ask the user to pay a small fee.

We will have to build a simple router.

```js
import { useEffect, useState } from "react";
import Doggy from "./Doggy";

function App() {
  const [page, setPage] = useState(document.location.hash);

  useEffect(() => {
    const onHashChange = () => {
      setPage(document.location.hash);
    };
    window.addEventListener("hashchange", onHashChange, false);
    return () => {
      window.removeEventListener("hashchange", onHashChange, false);
    };
  }, []);

  return (
    <div className="App">
      {(() => {
        switch (page) {
          case "#subscribe":
            return "Please pay a $3.00 per month subscription to continue viewing doggies.";
          default:
            return <Doggy />;
        }
      })()}
    </div>
  );
}

export default App;

```

Are we getting a little contrived? Yes, perhaps, but I think it's important to demonstrate

http://localhost:3000/#subscribe

```diff
  preloadImage: (url) => {
    var img = new Image();
    img.src = url;
  },
+
+ countFreeDoggies: () => {
+   produceNewState((state) => {
+     state.freeDoggiesViewed = state.freeDoggiesViewed + 1;
+   });
+
+   const { freeDoggiesViewed } = getState();
+
+   if (freeDoggiesViewed > 3) {
+     document.location.hash = "#subscribe";
+   }
+ },
});
```

Need to add two effects

```diff
  const {
    state: { doggyUrl },
-   actions: { fetchDoggy },
+   actions: { fetchDoggy, countFreeDoggies },
  } = useFlow({
    initialState: {
      doggyUrl: null,
      nextDoggyUrl: null,
      freeDoggiesViewed: 0,
    },
    actions: Doggy.actions,
  });

  useEffect(() => {
    fetchDoggy();
  }, []);

+ useEffect(() => {
+    if (doggyUrl) {
+     countFreeDoggies();
+   }
+ }, [doggyUrl]);
+
```

```
Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    at Doggy (http://localhost:3000/static/js/main.chunk.js:211:60)
```

It works! But look at your console. You should see this warning.

Why

Common problem with React async code.
Quite difficult to fix
useFlow provides a solution for it
Meant to be used wherever async code is used, as a best practice
To be clear, this is not a problem with useFlow, it is just that useFlow actually has a solution.

```diff
- Doggy.actions = ({ getState, produceNewState, actions }) => ({
+ Doggy.actions = ({ getState, produceNewState, unmountable, actions }) => ({
```
```diff
- const firstDoggyUrl = await actions.loadImageUrl();
+ const firstDoggyUrl = await unmountable(actions.loadImageUrl());
```
```diff
- const anotherDoggyUrl = await actions.loadImageUrl();
+ const anotherDoggyUrl = await unmountable(actions.loadImageUrl());
```
```diff
  loadImageUrl: async () => {
-   const rawResponse = await fetch("https://dog.ceo/api/breeds/image/random");
-   const { message: doggyUrl } = await rawResponse.json();
+   const { message: doggyUrl } = await unmountable(
+     fetch("https://dog.ceo/api/breeds/image/random").then((rawResponse) =>
+       rawResponse.json()
+     )
+   );
    return doggyUrl;
  },
```

These subscription warnings are getting annoying, to wrap up this tutorial, let's allow our users to pay.

```diff
        switch (page) {
          case "#subscribe":
-           return "Please pay a $3.00 per month subscription to continue viewing doggies.";
+           return (
+             <>
+               Please pay a $3.00 per month subscription to continue viewing
+               doggies.
+               <br />
+               <a href="#paid">Pay</a>
+             </>
+           );
+         case "#paid":
+           return <Doggy paid={true} />
          default:
-           return <Doggy />;
+           return <Doggy paid={false} />;
        }
```

```diff
-const Doggy = () => {
+const Doggy = ({ paid }) => {
  const {
    state: { doggyUrl, freeDoggiesViewed },
    actions: { fetchDoggy, countFreeDoggies },
  } = useFlow({
    initialState: {
      doggyUrl: null,
      nextDoggyUrl: null,
      freeDoggiesViewed: 0,
    },
    actions: Doggy.actions,
+   watched: { paid }
  });
```

explain watched

```diff
-Doggy.actions = ({ getState, produceNewState, unmountable, actions }) => ({
+Doggy.actions = ({
+  getWatched,
+  getState,
+  produceNewState,
+  unmountable,
+  actions,
+}) => ({
```

```diff
  countFreeDoggies: () => {
+   const { paid } = getWatched();
+   if (paid) return
+
    produceNewState((state) => {
      state.freeDoggiesViewed = state.freeDoggiesViewed + 1;
    });

    const { freeDoggiesViewed } = getState();

    if (freeDoggiesViewed > 3) {
      document.location.hash = "#subscribe";
    }
  },
```

Let's see where we ended up

```js
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import useFlow from "use-flow-hook";

const Doggy = ({ paid }) => {
  const {
    state: { doggyUrl },
    actions: { fetchDoggy, countFreeDoggies },
  } = useFlow({
    initialState: {
      doggyUrl: null,
      nextDoggyUrl: null,
      freeDoggiesViewed: 0,
    },
    actions: Doggy.actions,
    watched: { paid },
  });

  useEffect(() => {
    fetchDoggy();
  }, []);

  useEffect(() => {
    if (doggyUrl) {
      countFreeDoggies();
    }
  }, [doggyUrl]);

  if (!doggyUrl) return null;

  return (
    <img
      style={{ cursor: "pointer" }}
      onClick={fetchDoggy}
      src={doggyUrl}
      alt="Random dog from the free and open source dog.ceo/dog-api database."
    />
  );
};

Doggy.actions = ({
  getWatched,
  getState,
  produceNewState,
  unmountable,
  actions,
}) => ({
  fetchDoggy: async () => {
    const { doggyUrl, nextDoggyUrl } = getState();

    const anotherFetchInProgress = doggyUrl && !nextDoggyUrl;
    if (anotherFetchInProgress) {
      return;
    }

    const isFirstLoad = !doggyUrl;
    if (isFirstLoad) {
      const firstDoggyUrl = await unmountable(actions.loadImageUrl());
      produceNewState((state) => {
        state.doggyUrl = firstDoggyUrl;
      });
    } else {
      produceNewState((state) => {
        state.doggyUrl = nextDoggyUrl;
        state.nextDoggyUrl = null;
      });
    }

    const anotherDoggyUrl = await unmountable(actions.loadImageUrl());
    actions.preloadImage(anotherDoggyUrl);
    produceNewState((state) => {
      state.nextDoggyUrl = anotherDoggyUrl;
    });
  },

  loadImageUrl: async () => {
    const { message: doggyUrl } = await unmountable(
      fetch("https://dog.ceo/api/breeds/image/random").then((rawResponse) =>
        rawResponse.json()
      )
    );
    return doggyUrl;
  },

  preloadImage: (url) => {
    var img = new Image();
    img.src = url;
  },

  countFreeDoggies: () => {
    const { paid } = getWatched();
    if (paid) return;

    produceNewState((state) => {
      state.freeDoggiesViewed = state.freeDoggiesViewed + 1;
    });

    const { freeDoggiesViewed } = getState();

    if (freeDoggiesViewed > 3) {
      document.location.hash = "#subscribe";
    }
  },
});

export default Doggy;
```

You've seen all useFlow has to offer, every API.

With that, our scheme to make a fortune selling access to a free an open source is almost complete.

The only security vulnerability is the prospect of the user refreshing the page.