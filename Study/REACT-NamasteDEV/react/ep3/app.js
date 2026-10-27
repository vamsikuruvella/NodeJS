import React from "react";
import { createRoot } from "react-dom/client";

const reactHeading = React.createElement("h1",{id:'heading'},"Namaste React")
const jsxHeading = <h1 id="heading">JSX Heading</h1>
const root = createRoot(document.getElementById("root"));

root.render(jsxHeading);