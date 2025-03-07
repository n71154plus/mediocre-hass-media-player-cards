import { createContext, Fragment } from "preact";
import { HomeAssistant } from "custom-card-helpers";
import { AlbumArt, Title, Track } from "./components";
import { PlaybackControls } from "./components/PlaybackControls";

export type MediocreMassiveMediaPlayerCardConfig = {
  entity_id: string;
};

export const MediocreMassiveMediaPlayerCardContext = createContext<{
  hass: HomeAssistant;
  config: MediocreMassiveMediaPlayerCardConfig;
}>({
  hass: null,
  config: null,
});

export const MediocreMassiveMediaPlayerCard = () => {
  return (
    <Fragment>
      <style>
        {`
        .root {
          display: flex;
          flex-direction: column;
          gap: 16px;
          justify-content: space-around;
        }
        `}
      </style>
      <div className="root">
        <AlbumArt />
        <Title />
        <Track />
        <PlaybackControls />
      </div>
    </Fragment>
  );
};
