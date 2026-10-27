import React from "react";
import { createRoot } from "react-dom/client";
// import "./style.css";

function Header() {
  return (
    <nav className="navbar">
      <h2>Food App</h2>

      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
        <a href="#">Cart</a>
      </div>
    </nav>
  );
}
function Body(){
    return (
        <div className="body">
            <div className="Search">

            </div>
            <div className="res-container">
                
            </div>
        </div>
    )
}
function App() {
  return <>
  <Header/>
  <Body/>
  </>;
}

const root = createRoot(document.getElementById("root"));

root.render(<App />);
