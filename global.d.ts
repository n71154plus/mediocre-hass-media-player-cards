// global.d.ts

import { JSX } from "preact"; // Make sure to import Preact's JSX types

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ha-card": JSX.IntrinsicElements["div"]; // Or another appropriate element type if needed
    }
  }
}
