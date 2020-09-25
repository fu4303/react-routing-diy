import React from "react";

function App() {
  const [page, setPage] = React.useState(window.location.pathname);

  const navigate = (event) => {
    // stop the normal browser navigation
    event.preventDefault();
    window.history.pushState(null, null, event.target.pathname);
    setPage(event.target.pathname);
  };

  React.useEffect(() => {
    const onHistoryChange = () => {
      setPage(window.location.pathname);
    };
    window.addEventListener("popstate", onHistoryChange);
    return () => window.removeEventListener("popstate", onHistoryChange);
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
