import { render } from "preact";

import preactLogo from "./assets/preact.svg";
import "./style.css";

export function App() {
  return (
    <div>
      <a href="https://preactjs.com" target="_blank">
        <img src={preactLogo} alt="Preact logo" height="160" width="160" />
      </a>
      <h1>Get Started building Vite-powered Preact Apps </h1>
    </div>
  );
}

render(<App />, document.getElementById("app"));
