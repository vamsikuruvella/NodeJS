import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div>
      <h1>Hello React!</h1>
      <p>My first React application.</p>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));

root.render(<App />);