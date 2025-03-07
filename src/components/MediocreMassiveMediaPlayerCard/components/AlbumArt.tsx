import { useContext } from "preact/hooks";
import { MediocreMassiveMediaPlayerCardContext } from "../MediocreMassiveMediaPlayerCard";
import styled from "styled-components";

const ImgWrap = styled.div`
  aspect-ratio: 1;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  align-self: center;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const Img = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
`;

export const AlbumArt = () => {
  const { hass, config } = useContext(MediocreMassiveMediaPlayerCardContext);
  const artwork = hass.states[config.entity_id].attributes.entity_picture;

  if (!artwork) {
    return null;
  }

  return (
    <ImgWrap>
      <Img src={artwork} />
    </ImgWrap>
  );
};
