import { useContext } from "preact/hooks";
import { CardContext, CardContextType } from "../../../utils";
import { MediocreMediaPlayerCardConfig } from "../config";
import { Fragment } from "preact/jsx-runtime";
import styled from "styled-components";

const TitleText = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--primary-text-color, #333);
  margin-right: 32px;
`;

const ArtistText = styled.p`
  margin: 0px;
  font-size: 14px;
  color: var(--secondary-text-color, #666);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 32px;
`;

export const MetaInfo = () => {
  const { hass, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { entity_id } = config;
  const {
    media_title: title,
    media_artist: artist,
    media_album_name: albumName,
  } = hass.states[entity_id].attributes;

  const artistText = `${albumName !== title ? `${albumName} - ` : ""}${artist}`;

  return (
    <Fragment>
      {!!title && <TitleText>{title}</TitleText>}
      {(!!albumName || !!artist) && <ArtistText>{artistText}</ArtistText>}
    </Fragment>
  );
};
