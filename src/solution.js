import React from "react";

function App() {
  // initialise state to current URL path so refreshing works
  const [page, setPage] = React.useState(window.location.pathname);

  const navigate = (event) => {
    // stop the normal browser navigation
    event.preventDefault();
    // the link knows what path it points to (from its href attribute)
    const newPath = event.target.pathname;
    // update the URL/history
    window.history.pushState(null, null, newPath);
    // update state so this component re-renders
    setPage(newPath);
  };

  React.useEffect(() => {
    // whenever history changes update state to re-render the app
    const onHistoryChange = () => {
      setPage(window.location.pathname);
    };
    window.addEventListener("popstate", onHistoryChange);

    // return a cleanup function that removes the listener
    return () => window.removeEventListener("popstate", onHistoryChange);
    // empty arrays means this effect doesn't depend on any outside values
    // so it should never need to re-run
  }, []);

  return (
    <div>
      <nav>
        <a href="/" onClick={navigate}>
          Home
        </a>
        <a href="/about" onClick={navigate}>
          About
        </a>
        <a href="/contact" onClick={navigate}>
          Contact
        </a>
      </nav>
      {/* determine which component to render based on state value */}
      <main>
        {page === "/" && <Home />}
        {page === "/about" && <About />}
        {page === "/contact" && <Contact />}
      </main>
    </div>
  );
}

function Home() {
  return <h1>Home page</h1>;
}

function About() {
  return <h1>About page</h1>;
}

function Contact() {
  return <h1>Contact page</h1>;
}

export default App;
