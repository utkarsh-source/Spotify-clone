import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";
import { ContextProvider } from "./utils/Context";
import { ThemeProvider } from "styled-components";
import { theme } from "./utils/theme";
ReactDOM.render(
  <ContextProvider>
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
    </ContextProvider>,
  document.getElementById("root")
);
