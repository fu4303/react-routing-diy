import React from "react";

function App() {
  const [page, setPage] = React.useState("home");

  return (
    <div>
      <nav>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("about")}>About</button>
        <button onClick={() => setPage("contact")}>Contact</button>
      </nav>
      <main>
        {page === "home" && <Home />}
        {page === "about" && <About />}
        {page === "contact" && <Contact />}
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
