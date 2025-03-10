import { render } from "preact";
import {
  MediocreModernMediaPlayerCard,
  MediocreModernMediaPlayerCardConfig,
} from "../components";
import { CardContextProvider } from "../utils";

class MediocreModernMediaPlayerCardWrapper extends HTMLElement {
  config: MediocreModernMediaPlayerCardConfig = null;
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
        <MediocreModernMediaPlayerCard />
      </CardContextProvider>,
      this.content
    );
  }

  setConfig(config: MediocreModernMediaPlayerCardConfig) {
    if (!config.entity_id) {
      throw new Error("You need to define an entity_id");
    }
    this.config = config;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define(
  "mediocre-modern-media-player-card",
  MediocreModernMediaPlayerCardWrapper
);
