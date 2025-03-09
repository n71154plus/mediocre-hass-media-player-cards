import { render } from "preact";
import {
  MediocreMediaPlayerCard,
  MediocreMediaPlayerCardConfig,
} from "../components";
import { CardContextProvider } from "../utils";

class MediocreMediaPlayerCardWrapper extends HTMLElement {
  config: MediocreMediaPlayerCardConfig = null;
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
      <CardContextProvider
        rootElement={this}
        hass={hass}
        config={this.config}
      >
        <MediocreMediaPlayerCard />
      </CardContextProvider>,
      this.content
    );
  }

  setConfig(config: MediocreMediaPlayerCardConfig) {
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
  "mediocre-media-player-card",
  MediocreMediaPlayerCardWrapper
);
