import { useCallback, useContext } from "preact/hooks";
import { CardContext, CardContextType } from "../../../utils";
import { MediocreMediaPlayerCardConfig } from "../config";
import styled from "styled-components";
import { IconButton } from "../../IconButton";
import { fireEvent } from "custom-card-helpers";

const PlayerInfoWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;
const FriendlyNameText = styled.span`
  font-size: 11px;
  color: var(--secondary-text-color, #888);
  opacity: 0.8;
  font-style: italic;
`;

export const PlayerInfo = () => {
  const { hass, config, rootElement } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { entity_id, speaker_group } = config;
  const {
    friendly_name: playerName,
    icon,
    device_class: deviceClass,
  } = hass.states[entity_id].attributes;
  const groupMembers =
    hass.states[speaker_group?.entity_id ?? entity_id]?.attributes
      ?.group_members;
  const mdiIcon = getIcon({ icon, deviceClass });

  const handleMoreInfo = useCallback(() => {
    fireEvent(rootElement, "hass-more-info", {
      entityId: entity_id,
    });
  }, []);

  return (
    <PlayerInfoWrap>
      <IconButton Icon={mdiIcon} onClick={handleMoreInfo} size={"xx-small"} />
      <FriendlyNameText>{playerName}</FriendlyNameText>
      {groupMembers && groupMembers.length > 1 && (
        <FriendlyNameText>+{groupMembers.length - 1}</FriendlyNameText>
      )}
    </PlayerInfoWrap>
  );
};

const getIcon = ({
  icon,
  deviceClass,
}: {
  icon?: string;
  deviceClass?: string;
}) => {
  if (icon) {
    return icon;
  }
  switch (deviceClass) {
    case "speaker":
      return "mdi:speaker";
    case "receiver":
      return "mdi:audio-video";
    default:
      return "mdi:speaker";
  }
};
