import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);
  console.log(message);

  const [newmessage, setNewMessage] = useState("Loading...");
  useEffect(() => {
    fetch("/api/greet")
      .then((res) => res.json())
      .then((data) => setNewMessage(data.message));
  }, []);
  console.log(newmessage);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <h1>Message from server: {message}</h1>
        <h1>New Message from server: {newmessage}</h1>
      </header>
    </div>
  );
}

export default App;
