import { useContext } from "preact/hooks";
import { MediocreMassiveMediaPlayerCardConfig } from "../MediocreMassiveMediaPlayerCard";
import styled from "styled-components";
import { CardContext, CardContextType } from "../../../utils";

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
  const { hass, config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );
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
