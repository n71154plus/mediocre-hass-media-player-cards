import { CardContext, type CardContextType } from "../../utils";
import { useContext, useState } from "preact/hooks";
import type { MediocreMediaPlayerCardConfig } from "./config";
import styled from "styled-components";
import {
  AlbumArt,
  MetaInfo,
  PlaybackControls,
  PlayerInfo,
  SpeakerGrouping,
} from "./components";
import SpeakersIcon from "mdi-preact/SpeakersIcon";
import { IconButton } from "../IconButton";

const CardContent = styled.div<{ isOn: boolean }>`
  display: flex;
  gap: 14px;
  padding: 16px;
  opacity: ${(props) => (props.isOn ? 1 : 0.7)};
  transition: opacity 0.3s ease;
  position: relative;
  //   overflow: hidden;
  //   border-radius: 12px;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const GroupButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;

export const MediocreMediaPlayerCard = () => {
  const { hass, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { entity_id } = config;
  const [showGrouping, setShowGrouping] = useState(false);

  // Get the media player entity from hass
  const entity = hass.states[entity_id];

  if (!entity) {
    return <div>Entity {entity_id} not found</div>;
  }

  // Extract state and attributes
  const { state } = entity;

  // Determine if the player is on
  const isOn = !["off", "unavailable"].includes(state);

  // Check if grouping is available
  const hasGroupingFeature =
    config.speaker_group &&
    config.speaker_group.entities &&
    config.speaker_group.entities.length > 0;

  const toggleGrouping = () => {
    setShowGrouping(!showGrouping);
  };

  return (
    // @ts-ignore - ha-card is a custom element from Home Assistant
    <ha-card>
      <CardContent isOn={isOn}>
        <AlbumArt />
        <ContentContainer>
          <MetaInfo />
          <PlayerInfo />
          <PlaybackControls />
        </ContentContainer>
        {hasGroupingFeature && (
          <GroupButton>
            <IconButton
              size="x-small"
              onClick={toggleGrouping}
              Icon={"mdi:speaker-multiple"}
            />
          </GroupButton>
        )}
      </CardContent>
      {showGrouping && hasGroupingFeature && <SpeakerGrouping />}
      {/* @ts-ignore - ha-card is a custom element from Home Assistant */}
    </ha-card>
  );
};
