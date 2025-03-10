import { render } from "preact";
import {
  MediocreMassiveMediaPlayerCard,
  MediocreMassiveMediaPlayerCardConfig,
} from "../components";
import { CardContextProvider } from "../utils";

class MediocreMassiveMediaPlayerCardWrapper extends HTMLElement {
  config: MediocreMassiveMediaPlayerCardConfig = null;
  content: HTMLElement = null;

  set hass(hass) {
    // Initialize the content if it's not there yet.
    if (!this.content) {
      this.innerHTML = `
          <div class="card-content"></div>
      `;
      this.content = this.querySelector("div");
    }

    render(
      <CardContextProvider rootElement={this} hass={hass} config={this.config}>
        <MediocreMassiveMediaPlayerCard />
      </CardContextProvider>,
      this.content
    );
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config: MediocreMassiveMediaPlayerCardConfig) {
    if (!config.entity_id) {
      throw new Error("You need to define an entity_id");
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns in masonry view
  getCardSize() {
    return 1;
  }
}

customElements.define(
  "mediocre-massive-media-player-card",
  MediocreMassiveMediaPlayerCardWrapper
);
