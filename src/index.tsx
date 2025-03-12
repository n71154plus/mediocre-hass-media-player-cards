// I'm keeping this as a place to develop and test components
// Just add a mock hass object and config and mount the card component here
import { render } from "preact";
import "./style.css";

export function App() {
  return (
    <div>
      <h1>Playground</h1>
    </div>
  );
}

render(<App />, document.getElementById("app"));
