# Use Flow Tutorial

I think it would take at least an hour.

Fun little interactive page
Use every API useFlow has to offer
Solving a problem that would be quite difficult to fully solve with vanilla hooks.

## Requirements
- Terminal
- Node.js
- VSCode

```
cd ~/Projects
```
https://reactjs.org/docs/create-a-new-react-app.html
```
npx create-react-app use-flow-tutorial
```
```
cd use-flow-tutorial
```
```
npm start
```
Open another terminal window, same directory
```
code .
```
https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line

Look for
```
Edit <code>src/App.js</code> and save to reload.
```

```
npm install --save use-flow-hook
```

Delete everything inside 
    <div className="App">
    </div>

Blank white page

create
Doggy.jsx

https://mixedanalytics.com/blog/list-actually-free-open-no-auth-needed-apis/

https://dog.ceo/dog-api/

```json
{
    "message": "https://images.dog.ceo/breeds/terrier-patterdale/Patterdale.jpg",
    "status": "success"
}
```

Before doing anything complicated, just get a simple 

```js
const Doggy = () => {
  const doggyUrl = 'https://images.dog.ceo/breeds/terrier-patterdale/Patterdale.jpg'
  return <img src={doggyUrl} />
}

export default Doggy
```

```js
import Doggy from "./Doggy";

function App() {
  return (
    <div className="App">
      <Doggy />
    </div>
  );
}

export default App;
```

Alt text
- Don't use the word picture or image
- Write the copy to describe both the image and its context within the page.
- Remember to capture the emotional content of the image.
- "Random dog from the free and open source dog.ceo/dog-api database."

```js
<img
  src={doggyUrl}
  alt="Random dog from the free and open source dog.ceo/dog-api database."
/>
```

Doggy has appeared!

Now design API. First, boilerplate.

```js
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

- doggyUrl
- a function that will actually fetch the doggy, called fetchDoggy. We know this function will be async because it will make the request to the dog.ceo API.

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

```diff
useDoggy.actions = () => ({
- fetchDoggy: async () => {},
+ fetchDoggy: async () => {
+   const rawResponse = await fetch("https://dog.ceo/api/breeds/image/random");
+   const { message: doggyUrl } = await rawResponse.json();
+ },
});
```

first helper function, produceNewState

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

Still not working! Haven't started the request.

The pattern here is the same as any component, requests are a side effect

useEffect
```diff
+import { useEffect } from "react";
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

2 issues: one is a warning
ok to add fetchDoggy
https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies
it is safe either way
shooting yourself in the foot
useFlow comes in here

```diff
+ /* eslint-disable react-hooks/exhaustive-deps */
  import { useEffect } from "react";
  import useFlow from "use-flow-hook";

  const Doggy = () => {
```

Other issue: flash of broken image

```diff
  useEffect(() => {
    fetchDoggy();
  }, []);

+ if (!doggyUrl) return null

  return (
    <img
      src={doggyUrl}
      alt="Random dog from the free and open source dog.ceo/dog-api database."
    />
  )
```

now enable clicking

```diff
  return (
    <img
+     onClick={fetchDoggy}
      src={doggyUrl}
      alt="Random dog from the free and open source dog.ceo/dog-api database."
    />
  )
```

cursor pointer

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

it was almost too easy, complexity budget still full
sneak in some unspecced features
takes a second to load
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
Use flow provides a solution for it
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