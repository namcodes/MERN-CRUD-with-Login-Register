import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const container = ReactDOM.createRoot(document.getElementById("container"));

container.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
