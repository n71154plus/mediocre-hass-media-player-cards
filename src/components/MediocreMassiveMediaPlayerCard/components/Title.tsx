import { useContext } from "preact/hooks";
import { MediocreMassiveMediaPlayerCardContext } from "../MediocreMassiveMediaPlayerCard";
import styled from "styled-components";

const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const TitleH2 = styled.h2`
  margin: 0px;
`;

const TitleH3 = styled.h3`
  margin: 0px;
  font-weight: normal;
`;

export const Title = () => {
  const { hass, config } = useContext(MediocreMassiveMediaPlayerCardContext);
  const title = hass.states[config.entity_id].attributes?.media_title;
  const artist = hass.states[config.entity_id].attributes?.media_artist;
  const albumName = hass.states[config.entity_id].attributes?.media_album_name;
  if (!title && !artist && !albumName) {
    return null;
  }
  return (
    <TitleWrap>
      {!!title && <TitleH2>{title}</TitleH2>}
      {(!!albumName || !!artist) && (
        <TitleH3>{`${albumName ?? ""} - ${artist ?? ""}`}</TitleH3>
      )}
    </TitleWrap>
  );
};
