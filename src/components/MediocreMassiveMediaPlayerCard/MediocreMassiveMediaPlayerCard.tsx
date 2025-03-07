import { createContext } from "preact";
import { HomeAssistant } from "custom-card-helpers";
import { AlbumArt, Title, Track } from "./components";
import { PlaybackControls } from "./components/PlaybackControls";
import styled from "styled-components";

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

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: space-around;
`;

export const MediocreMassiveMediaPlayerCard = () => {
  return (
    <Root>
      <AlbumArt />
      <Title />
      <Track />
      <PlaybackControls />
    </Root>
  );
};
