# Learn React Routing

Learn how to implement client-side routing in React from scratch.

## Setup

1. Clone this repo
1. `npm i`
1. `npm start`

## Client-side routing

Single-page apps only have one actual HTML page sent by the server. In a React app this is usually an `index.html` containing a single `<div id="root">`. You render the entire app into this div using JavaScript.

However the concept of "pages" that are accessed at different URLs is still useful. This allows people to be linked directly to different parts of your app, or use the browser's back/forward buttons to navigate. Client-side routing allows us to build an SPA but keep some of the useful features of standard "multi-page" websites.

## Part 1: DIY router

### Fake routing

Pretty much all apps need to render different stuff as the user interacts. The easiest way to achieve this is with buttons that update some state value to tell your app what component should be rendered.

Open `src/App.js` to see an example of this. Each button updates the `page` state variable to a different string. We then render different components based on that string.

Run the dev server and view the app in your browser. You may notice a couple of problems with this approach:

1. The URL doesn't change as we go to different "pages"
1. Our browser history doesn't update (the back button doesn't work)
1. Refreshing always resets us back to the home page

### Real routing

We can improve this by using the URL as the "source of truth" for our page state. If we always update the URL when we set the state then they should stay in sync. This means when the user clicks "About" the URL should update to localhost:3000/about.

The browser has a method for updating the URL: `window.history.pushState`. This will create a new entry in the browser history as if the user clicked a real link.

```js
window.history.pushState(null, null, "/about");
```

It takes 3 arguments, but we don't need the first two, so they're set to `null`.

To ensure refreshing the page works we should also set the initial state value to whatever the URL's pathname is. For example is the user refreshes on `/about` the initial state will be `/about`, so the `<About />` component will be shown.

#### Challenge 1

1. Change the initial state value to use `window.location.pathname`
1. Edit the buttons' click handlers to update the browser history as well as setting state
1. Change the conditions for each page component to match the new pathname state values
  Hint: the homepage's pathname should be "/", not "/home"

When you're done the app should work like before, but with the URL updating.

<details>
<summary>Solution</summary>

```js
function App() {
  // initialise state to current URL path so refreshing works
  const [page, setPage] = React.useState(window.location.pathname);

  const navigate = (pathname) => {
    // update the URL/history to the new path
    window.history.pushState(null, null, pathname);
    // update state so this component re-renders
    setPage(pathname);
  }

  return (
    <div>
      <nav>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/about")}>About</button>
        <button onClick={() => navigate("/contact")}>Contact</button>
      </nav>
      <main>
        {page === "/" && <Home />}
        {page === "/about" && <About />}
        {page === "/contact" && <Contact />}
      </main>
    </div>
  );
}
```

</details>

### Using real links

This solution can still be improved. Button's aren't really the right element for navigation: that's what the `<a>` tag is for. Using the semantically correct element is better for accessibility (and it means the default styling is closer to a normal multi-page site).

If we change our buttons to links we also need to prevent their default click behaviour. Usually links send a request to the server for whatever URL is in their `href` attribute, then cause the browser to load the response as a totally new page.

Since we're re-implementing navigation ourselves we want to stop this using `event.preventDefault()` in the click handler.

We can also use the same click handler for every link, since each link already knows where to navigate to (from its `href` attribute). You can grab the pathname a link points to from `event.target.pathname`.

#### Challenge two

1. Replace the buttons with links
1. Set the `href` attribute on each link to the path it should navigate to
1. Amend the click handler to use `event.target.pathname` and prevent the default navigation

<details>
<summary>Solution</summary>

```js
function App() {
  const [page, setPage] = React.useState(window.location.pathname);

  const navigate = (event) => {
    // stop the normal browser navigation
    event.preventDefault();
    // the link knows what path it points to (from its href attribute)
    const newPath = event.target.pathname;
    window.history.pushState(null, null, newPath);
    setPage(newPath);
  }

  return (
    <div>
      <nav>
        <a href="/" onClick={navigate}>Home</a>
        <a href="/about" onClick={navigate}>About</a>
        <a href="/contact" onClick={navigate}>Contact</a>
      </nav>
      <main>
        {page === "/" && <Home />}
        {page === "/about" && <About />}
        {page === "/contact" && <Contact />}
      </main>
    </div>
  );
}
```

</details>

### Fixing history

You may have noticed the back/forward buttons still don't work. Although we're pushing new entries into the browser history when links are clicked, we aren't updating our page state when the history changes. This is why the app doesn't re-render when you click the back button.

Luckily there's a browser event for this: `popstate`. This event fires on the window whenever the history changes, You can then update your page state to whatever the new URL is, which will re-render the app with the right UI.

#### Challenge 3

1. Use `React.useEffect` to add a `popstate` event listener to the `window`
1. Inside the listener callback update the page state to the new URL pathname
1. Make sure to clean up the effect by removing the event listener

<details>
  <summary>Solution</summary>

  ```js
  React.useEffect(() => {
    // whenever history changes update state to re-render the app
    const onHistoryChange = () => {
      setPage(window.location.pathname);
    };
    window.addEventListener("popstate", onHistoryChange);
    // return a cleanup function that removes the listener
    return () => window.removeEventListener("popstate", onHistoryChange);
  }, []);
  ```

</details>

Now your back and forward buttons should correctly navigate and re-render your app. That's it, you've made a whole client-side router!
