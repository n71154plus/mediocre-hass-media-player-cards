import { render } from "preact";
import {
  MediocreMediaPlayerCard,
  MediocreMediaPlayerCardConfig,
} from "../components";
import { CardContextProvider } from "../utils";

class MediocreMediaPlayerCardWrapper extends HTMLElement {
  config = null;
  content: HTMLElement = null;

  set hass(hass) {
    render(
      <CardContextProvider rootElement={this} hass={hass} config={this.config}>
        <MediocreMediaPlayerCard />
      </CardContextProvider>,
      this
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
