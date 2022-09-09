# useFlow Tutorial

This tutorial, which I think it will take at least an hour, demonstrates how you can use useFlow to tackle some real engineering challenges - challenges that would be quite difficult to fully solve with vanilla hooks! - as you build a cute little doggy viewer. And it uses every API useFlow has to offer, so you'll be an expert by the end, and I really mean that!

## Requirements

You'll need some basic JavaScript and React knowledge, you'll need Node installed and a terminal, but I'll try my best to make sure it isn't too intimidating to the relative newcomers out there.

## Off We Go!

In a terminal navigate to the folder outside the folder where you want to create the tutorial project:

```
cd ~/Projects
```

Run the command from [Create React App](https://reactjs.org/docs/create-a-new-react-app.html) that will create a use-flow-tutorial folder and put a basic React app into it.

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

Open the tutorial folder in your code editor. Feel free to use any code editor you want. If you are using VSCode, you can try running this command (in a second terminal window) to view the code:

```
code .
```

If your terminal says the `code` command is not found, [this article](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line) might help.

In the code editor, take a look around. 

To get started, let's install useFlow. Run the command in a second terminal window.

```
npm install --save use-flow-hook
```

Or, if you have yarn installed:

```
yarn add use-flow-hook
```

In the code editor, look for the snippet below, which is in `App.js`:

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

In `Doggy.jsx`, let's create an oversimplified component that shows the image linked above.

```js
import React from "react";

const Doggy = () => {
  const doggyUrl = 'https://images.dog.ceo/breeds/terrier-patterdale/Patterdale.jpg'
  return <img src={doggyUrl} />
}

export default Doggy
```

Of course this component isn't used anywhere, so it won't appear on the page yet. Let's remedy that, in `App.js`.

```diff
-import logo from "./logo.svg";
import React from "react";
+import Doggy from "./Doggy";

function App() {
- return <div className="App"></div>
+ return <div className="App"><Doggy /></div>
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

Most of the bones are in place now, and I am itching to design the internal data structure for our Doggy component, and by that, I mean choosing the names for the _state_ and _actions_ that we're going to add. State, in this context, is data (numbers, strings, objects, arrays, etc.) associated with the component, and actions are functions with the power to change the state. 

But before we jump into that, let's write out all the boilerplate needed for useFlow to work.

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

  But even when we do start adding state and actions here, I want to note that the list does not need to be comprehensive, and it will only include state or actions which are needed within the React component part of the file. Since this is hard to explain without examples, just know there will be more on this later.
- ```js
  initialState: {},
  ```
  The `initialState` is where we will list all the state we will need to keep track of inside useFlow. This object _must_ include all the state we plan on using. In fact, if you try to create some state that isn't listed here, useFlow will throw an error! This requirement gives us confidence that all the state we are using is fully documented in one place. This makes it a "self-documenting" feature.
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

Part of the reason I wouldn't recommend using useFlow in a component unless you really need it is that its boilerplate would complicate a component which only needs one or two `useState` hooks.

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

This is much closer, but we have still not set the `doggyUrl`! `const { message: doggyUrl }` sets a local variable within the action, but this is not the same as setting the state within useFlow.

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

  This approach is less error-prone than other methods of handling immutable data, such as React's setState or Redux's reducers, where you need to carefully avoid methods like `array.push()` which mutate the array. With `produceNewState`, you can simply use `array.push()`!

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

`useEffect` is a bread-and-butter hook in React for triggering side effects and running code that shouldn't run on every render. As you may have heard, passing `[]` tells React to run the effect once on mount, passing no dependency array tells React to run the effect on every render, and passing a dependency array will tell React to run the effect only when the values in the dependency array changed since the last render.

Depending on your text editor, you may have already seen a warning appear on the `[]` part of `useEffect`, and the warning is asking you to add `fetchDoggy` to the dependency array.

Although we are indeed going to add `fetchDoggy` to the dependency array, I want to emphasize that it would work perfectly fine without it. A depency array of `[]` is functionally identical to `[fetchDoggy]` - both will run only once when the component mounts.

Probably the reason this is confusing is that the dependency array has two functions:

1) Tell React when you want your effect to run. In this case, once when the component mounts.
2) Prevent stale data from making its way into the effect code.

Stale data can cause horrible bugs which require extended debugging sessions to catch and much longer to really understand how and why it's happening. And it's reason number 2 that the React team has turned on the rule.

In fact, the rule basically requires us to use the dependency array to handle problem number 2 only, and it encourages us to solve problem number 1 in other ways, like a carefully crafted if statement within the hook. 

useFlow makes stale data much less likely to occur, chiefly by helping you keep your effects extremely small. As soon as your effects trigger a useFlow action, you enter a domain which is immune from stale data.

```diff
  useEffect(() => {
    fetchDoggy();
- }, []);
+ }, [fetchDoggy]);
```

The good news is that a dog has appeared on the page! The bad news is that, when you refresh the page, there is a broken image flashing there for a moment.

Before we celebrate, let's fix that. The problem is that `doggyUrl` can be `null`, and an `img` with a `null` `src` is a broken image.

The solution is to return `null` from the component while it's waiting for data.

```diff
  useEffect(() => {
    fetchDoggy();
  }, [fetchDoggy]);

+ if (!doggyUrl) return null
+

  return (
    <img
      src={doggyUrl}
      alt="Random dog from the free and open source dog.ceo/dog-api database."
    />
  )
```

A little celebration is in order! But one line can make it ten times cooler:

```diff
  return (
    <img
+     onClick={fetchDoggy}
      src={doggyUrl}
      alt="Random dog from the free and open source dog.ceo/dog-api database."
    />
  )
```

This change allows us to load more pictures just by clicking!

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

So let's optimize the performance of our app, which will be a great opportunity to take our tutorial from the oversimplified situation we've handled so far into something at the complexity-level of a real-world application and see how useFlow handles it.

Right now, each image takes a small-but-perceptible time to load. What would be cooler is for each image to load instantaneously. But how? 

How about instead of waiting for the user to click, we load the next image immediately in the background. When they finally do click, the image will be ready and waiting.

So I googled a bit, and found [a snippet of JavaScript](https://stackoverflow.com/questions/3646036/preloading-images-with-javascript) on Stack Overflow that should do nicely.

```js
function preloadImage(url)
{
    var img=new Image();
    img.src=url;
}
```

Let's add this to the actions.

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

And now what? Just like before, a good place to start would be to revisit the state for the component.

Previously, we were dealing with one URL for the current image. Now, it seems we need to deal with two. The current one, and the upcoming one. That would be a good next step.

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

This addition means we can now assign the `nextDoggyUrl` within an action. 

Can you see that we only added it to the `initialState` but we didn't return it from useFlow? We don't need to return all the state we use from useFlow. Some state is entirely internal to the actions, and that's okay.

Next, I'm going to spend a minute or two staring at the `fetchDoggy` action with preloading in mind.

When we load a URL, we should immediately fetch another URL. Or something like that. But there does seem to be two parts to this. One to fetch a URL, and one to coordinate the requests.

```diff
-useDoggy.actions = ({ produceNewState }) => ({
+useDoggy.actions = ({ produceNewState, actions }) => ({
+ fetchDoggy: async () => {},
+
- fetchDoggy: async () => {
+ loadImageUrl: async () => {
    const rawResponse = await fetch("https://dog.ceo/api/breeds/image/random");
    const { message: doggyUrl } = await rawResponse.json();
-   produceNewState((state) => {
-     state.doggyUrl = doggyUrl;
-   });
+   return doggyUrl;
  },

  preloadImage: (url) => {
    var img = new Image();
    img.src = url;
  },
});
```

Do you see what I'm thinking? I converted the old `fetchDoggy` into a utility with a new name, `loadImageUrl`, and made it stateless. Now both `loadImageUrl` and `preloadImage` are labeled little bits of code that we can use in the new, more advanced `fetchDoggy` action.

As for how to use these little bits of code, another change is the addition of `actions` next to `produceNewState`. `actions` is an object that allows us to call one action from another action. Right now `actions` will contain three functions, `fetchDoggy`, `loadImageUrl` and `preloadImage`.

But what to put in the `fetchDoggy` function? Probably we need to set the `doggyUrl` to the `nextDoggyUrl`, and we need to load the next image. 

```diff
-useDoggy.actions = ({ produceNewState, actions }) => ({
+useDoggy.actions = ({ getState, produceNewState, actions }) => ({
  fetchDoggy: async () => {
+   const { doggyUrl, nextDoggyUrl } = getState();
+   produceNewState((state) => {
+     state.doggyUrl = nextDoggyUrl;
+   });
+
+   const preloadDoggyUrl = await actions.loadImageUrl();
+   produceNewState((state) => {
+     state.nextDoggyUrl = preloadDoggyUrl;
+   });
  },
```

First things first, I should note that this is not yet working. But this is what I wrote as a first attempt.

You'll notice a new helper function has appeared, `getState`. This function returns the object containing the latest state.

One thing I'm thinking about `fetchDoggy` right now is that both `doggyUrl` and `nextDoggyUrl` might be `null`. I need to add some logic to handle the case where things haven't yet completely loaded.

```diff
  fetchDoggy: async () => {
    const { doggyUrl, nextDoggyUrl } = getState();
+
+   const isFirstLoad = !doggyUrl;
+   if (isFirstLoad) {
+     const firstDoggyUrl = await actions.loadImageUrl();
+     produceNewState((state) => {
+       state.doggyUrl = firstDoggyUrl;
+     });
+   } else {
     produceNewState((state) => {
       state.doggyUrl = nextDoggyUrl;
+      state.nextDoggyUrl = null;
     });
+   }

    const preloadDoggyUrl = await actions.loadImageUrl();
    produceNewState((state) => {
      state.nextDoggyUrl = preloadDoggyUrl;
    });
  },
```

I spent some time staring at this version.

The first time through, it will call `loadImageUrl` twice. Every other time it will call it once. That makes sense to me.

After a few dozen more read-throughs I built up enough resolve to peek over at the browser and check if it was working. 

To my pleasant surprise, it did seem to be working!

Not so fast. I opened the network tab in Chrome DevTools, and watched the images load, and I noticed that the latest image loaded is the one I see on the screen. It's not preloading! And come to think of it, the performance hadn't improved.

```diff
    const preloadDoggyUrl = await actions.loadImageUrl();
+   actions.preloadImage(preloadDoggyUrl);
    produceNewState((state) => {
      state.nextDoggyUrl = preloadDoggyUrl;
    });
  },
```

If it's not preloading, maybe that means you're not preloading.

Let's try again.

After a page refresh, I saw what I expected, an extra image was appearing in the network tab... and the image loading is now instantaneous. Great!

Naturally the next thing to do is click through doggies as fast as I can. But boom, one doggy in and it seems we get stuck on a white screen. No errors.

This is a bug. But why?

Let me think.

Okay, I realized that strange behavior might occur if two `fetchDoggy` calls run at the same time.

The line `doggyUrl = nextDoggyUrl` would set `doggyUrl` to `null` if `nextDoggyUrl` hadn't finished loading. And if `doggyUrl` is `null` the component will not return the `img` so you'll get a white screen. And if there's no image, there's no way to get to the next doggy.

The solution is to make sure `fetchDoggy` will stop itself if another instance of `fetchDoggy` is already in progress.

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

Here's the whole file so far!

```js
import { useEffect } from "react";
import useFlow from "use-flow-hook";

const Doggy = () => {
  const {
    state: { doggyUrl },
    actions: { fetchDoggy },
  } = useFlow({
    initialState: {
      doggyUrl: null,
      nextDoggyUrl: null,
    },
    actions: Doggy.actions,
  });

  useEffect(() => {
    fetchDoggy();
  }, [fetchDoggy]);

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

I thought it would be interesting to share a bit of the existential angst of watching code fail in various ways before it eventually succeeds, and it is nice now to be on the other side where it is now working properly.

I would say that writing this code was not particularly easy, but what made it hard was not React, or useFlow, but the problem at hand that we were grappling with.

Now, consider writing this with vanilla hooks. Perhaps I'm biased, but I think it would have been much harder to do all this inside a bunch of `useCallback` and `useEffect` calls, with `useState` and `useRef` to pass around the state. The high reactivity of hooks, where we cannot easily tell the sequence of events that led to our code needing to run, would conflict with our feature's need to behave quite differently each time it runs. Perhaps it wouldn't even be worth the effort.

This is why I decided to open-source useFlow in the first place - after a few projects where I felt like I couldn't get from point A to point B without it, I started feeling like other people might enjoy a utility like this.

But we haven't seen all of useFlow's APIs yet, and furthermore, there is a very common issue with this component lurking beneath the surface, waiting to pop up. So let's soldier on and imagine our app has gotten a bit further and now contains a few pages.

Here is a new `App.js` to use - go ahead and replace the entire content of the file with this:

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

I implemented a little router here, using the hash part of the URL. It's sort of beside the point to get too deep into it here, but, heck, I think it would still be fun to explain how it works!

Before I jump into the code itself, just a little context: the hash part of a URL is anything followed by `#`, (e.g. `http://example.com/doggy#this-is-the-hash-part`) and its main function, and probably the reason it was originally introduced, was to support links from one part of a page to another. However, another capability it has is that it can be used to keep track of what "page" (i.e. the content filling the window) is showing _without leaving the actual HTML page_ the URL bar is pointing at.

This is crucial because we are working on a single page app, and having the browser actually load another HTML page would be basically equivalent to force quitting and relanching our app, which is definitely not our intention.

Even though there's a newer and more purpose-built API for controlling the URL that doesn't need the hash, for whatever complicated-and-sort-of-meaningless reasons the hash is still the simplest way to switch between pages. All you need is a little event listener and you can call `document.location.hash = "#something"` and it will update the URL and trigger your event listener, which can then switch the page that's showing.

Whenever I create an app using simple HTML and no framework, no React, I do something like that. And it also works in React, of course, which is what I've done here.

- ```js
  const [page, setPage] = useState(document.location.hash);
  ```
  This line uses `useState` to create a page variable. This is going to store the current page, which originates from the hash. The current hash value is its starting value.
- ```js
  const onHashChange = () => {
    setPage(document.location.hash);
  };
  window.addEventListener("hashchange", onHashChange, false);
  ```
  This snippet is inside the `useEffect`, and it attaches the event listener that will fire whenever the hash changes. The `false` is something to do with event bubbling (?) and the event listener won't work without it, it seems.

  When the hash changes, we need to synchronize its latest value with the state of our component, and that's what `setPage` is doing.

  Now to explain why `onHashChange` is assigned to a variable instead of being passed directly to the event listener:
- ```js
  return () => {
    window.removeEventListener("hashchange", onHashChange, false);
  };
  ```
  React requires event listeners to be cleaned up by returning a function from `useEffect`. And a peculiarity of `removeEventListener` is that you need to call it with exactly the same function variable that you used when you created it.
- ```js
  {(() => {
    // ...
  })()}
  ```
  Okay, what is this barrage of symbols?

  The outer `{}` is JSX-specific, and it allows us to insert some JavaScript at this point.

  The inner `() => {}` is the familiar syntax for an arrow function.

  The function is wrapped with parentheses.

  Following the parentheses wrapping the function is `()`, which calls the function.

  So, OK, but what does it actually do? This is a way to insert a block of code somewhere a block of code is not permitted. JSX is one such place: normally you can only put a single expression inside `{}`, which is the same reason you can use `{isTrue ? true : false}` in JSX but not a full if statement like `{if (isTrue) { true; } else { false; }}`.

  Given this design limitation of JSX, that means we are not allowed to use a switch statement inside JSX. But what if the switch makes the most sense inside the JSX? Well this trick will give you a way to insert it there.

  By the way this type of expression is called an IIFE, an "immediately-invoked function expression."
- ```js
  switch (page) {
    case "#subscribe":
      return "Please pay a $3.00 per month subscription to continue viewing doggies.";
    default:
      return <Doggy />;
  }
  ```
  This is the actual meat of the router. The default page is the Doggy component, and as you can see, I added another page that just has some text on it, and it's asking the user to pay for their dang doggies.
  
  Give it a try and visit `http://localhost:3000/#subscribe` - you should see the message.

With a simple router in hand, we can return to `Doggy.jsx`. So what is my goal here, and why am I going to all this effort to introduce a second page?

The reason is I want to show you a way our current app can explode. Ok, maybe explode is a bit dramatic a term - but I want to show you that the way we built our app, which felt pretty much perfect before, is vulnerable to a really common React warning that pops up whenever you start using async code.

So let's send the user to the subscription page when they've viewed their alloted number of free doggy views, which is 3. More than 3, and they'll have to pay us.

```diff
    initialState: {
      doggyUrl: null,
      nextDoggyUrl: null,
+     freeDoggiesViewed: 0,
    },
```

```diff
  preloadImage: (url) => {
    var img = new Image();
    img.src = url;
  },
+
+ countFreeDoggies: () => {
+   produceNewState((state) => {
+     state.freeDoggiesViewed += 1;
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

Now that we have the action, we need to make sure the action will actually run.

We could call `actions.countFreeDoggies()` from the `fetchDoggy` action, but `fetchDoggy`, to me, is already at the limit of the amount of complexity I want in a single function, so instead I want to put it in an effect, and have React call it whenever the `doggyUrl` changes.

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
  }, [fetchDoggy]);
+
+ useEffect(() => {
+    if (doggyUrl) {
+     countFreeDoggies();
+   }
+ }, [doggyUrl, countFreeDoggies]);
```

Since `doggyUrl` can be `null` I had to put an if statement around `countFreeDoggies`.

And there it is, once you navigate back to http://localhost:3000/, not only should you now experience a three doggy limit, you should also see the following warning in the console:

```
Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    at Doggy (http://localhost:3000/static/js/main.chunk.js:211:60)
```

If you have worked with React much before I am almost certain that you've seen this warning. Maybe you've seen it a thousand times.

Why does it happen? Is there really a memory leak? Is it as serious as it sounds?

The answer is, it's probably not serious, but React has no way to tell if it is serious. All React knows is that _a component that's no longer on the page is still running around and doing stuff_. It is a bit strange to imagine that a component which is no longer on the page is still functioning somehow. This is something kind of amazing and quite unnatural, and it emerges from the way JavaScript and the web do garbage collection.

So what is our component actually doing from beyond the grave?

What happens is something like this:

1. The 3rd doggy image is showing on the page.
2. The user clicks the image to load another.
3. The `fetchDoggy` action fires.
4. `fetchDoggy` updates the `doggyUrl`
5. `countFreeDoggies` fires because the `doggyUrl` changed.
6. `countFreeDoggies` sees that more than 3 free doggies were viewed and changes the page to `#subscribe`.
7. React unmounts the Doggy component since we are now on the subscribe page.

At this point, everything makes sense. Except for one detail. `fetchDoggy` is still running. So here's what happens next.

8. `fetchDoggy` finishes loading the `nextDoggyUrl` and sets it.
9. React notices that this component - which is invisible and unmounted - is running around and doing stuff. This could be bad, because it could really be a memory leak. And it triggers the warning at this point.

This is how the warning occurs. And let me just finish off this play-by-play by showing what actually happens to our supposed memory-leak:

10. `fetchDoggy` completes.
11. The JavaScript engine, which is run by the browser, runs the garbage collector and detects that no variables or references exist to the old <Doggy /> instance, and it is therefore safe to delete from memory.
12. The memory for the old instance is deleted, and the memory leak is closed.

A case that would actually be a memory leak would be something like `setInterval` which would never actually complete.

React gets a lot of heat for this warning, but it's really just trying to be helpful, although it does end up being a bit overdramatic in most cases.

Normally, fixing this warning is not very easy to do. Technically, the "mistake" we made was not providing a cleanup function to be run when the component unmounts to cancel all pending `fetch` requests (and in-progress image requests). But in practical terms, cleaning up `fetchDoggy()` is not easy, requiring digging into lesser-known and situation-specific APIs like fetch's [AbortController.signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal) and the [img tag supporting cancelation when the src is set to an empty string](https://stackoverflow.com/questions/5278304/how-to-cancel-an-image-from-loading).

Any time you use a promise in React, any async await, you need to figure out how to cancel it. This is a pain to figure out in and of itself, but what really makes it worse is the fact that it's usually not necessary, since the memory leak warning is simply being overly cautious. 

So this is an problem that cannot be solved in a generalizable way.

Except in useFlow, there actually is a general-purpose helper to document, explicitly, our intent to immediately shut down our component when it unmounts.

This is a feature I think is really cool, because it is such a common problem in async React code, and yet I've never seen an approach that can address it pretty much universally.

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

What we've done is add our fourth helper, `unmountable`, and used it to wrap all our promises.

When the component unmounts, the promises will reject - they will actually throw an error - and therefore the code following the promise will never execute.

The fact they throw an error isn't a problem because useFlow is able to catch that specific error.

Cool, right?

By the way, in case you're curious about the `.then()` I added to `loadImageUrl`, it is equivalent to:

```js
      const rawResponse = await unmountable(fetch("https://dog.ceo/api/breeds/image/random"));
      const { message: doggyUrl } = await unmountable(rawResponse.json());
```

I just thought the former was cleaner code.

You will notice that the warning no longer appears. We really solved it.

There is one more API we haven't used yet, and the fact I can only see three dogs is starting to annoy me, so let's introduce an ability for users to actually pay us and get access to unlimited doggies.

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

- This adds a link which says "Pay" on the subscription page.
- Then we add a page at the hash "#paid" which shows the Doggy component.
- We add a prop to the `Doggy` component for whether the user is paying or not.
- The `<>...</>` is a React fragment. Based on the way JSX converts itself into JavaScript functions under the hood, it's required when you want to return more than one child component and/or string from a component.

We now need to add this `paid` prop to the `Doggy` component.

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

Adding the `paid` prop is typical React, but what is `watched`? `watched` allows you to bring external data into your actions - data that you are not actually updating or synchronizing and therefore is not state, but just want to have available.

This will allow us to disable the free doggy counting, using the final helper, `getWatched`.

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
      state.freeDoggiesViewed += 1;
    });

    const { freeDoggiesViewed } = getState();

    if (freeDoggiesViewed > 3) {
      document.location.hash = "#subscribe";
    }
  },
```

Now, after you see the subscribe page, you can click "Pay" and enjoy access to unlimited doggies.

Before I wrap this up, let's take a nice look over the entire `Doggy.jsx` file.

```js
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
  }, [fetchDoggy]);

  useEffect(() => {
    if (doggyUrl) {
      countFreeDoggies();
    }
  }, [doggyUrl, countFreeDoggies]);

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
      state.freeDoggiesViewed += 1;
    });

    const { freeDoggiesViewed } = getState();

    if (freeDoggiesViewed > 3) {
      document.location.hash = "#subscribe";
    }
  },
});

export default Doggy;
```

I think, in terms of size and complexity, that's a really satisfing amount of functionality in one component. But as it grows and gets more complicated, that's where the benefits of hooks start to come in.

Before, using the class syntax, it was extremely difficult to pull out logic from a single component into multiple files.

Hooks give you everything you need to break a component like this into two or three files, each with its own internal state, its own abstractions, and its own hidden complexities. For this Doggy application, there might eventually be one component for the UI, a hook for managing the `doggyUrl` and a hook for tracking the subscription status. Transitioning to a more expansive architecture can occur gradually as the project develops.

Basically what I'm saying is, applying useFlow to one component in this tutorial is just the beginning. When you scale it up across a reactive tree of components, that's where you will start finding it difficult to go back to the way things were before.

The only hard part is finding a challenge worthy of it!

Bringing this tutorial to a close, you've now seen all useFlow has to offer, every API. I hope you found it useful, or interesting, and for my part it was fun showing it off!

With that, our scheme to make a fortune selling access to a free and open source API is almost complete.

The only security vulnerability is the prospect of the user refreshing the page.