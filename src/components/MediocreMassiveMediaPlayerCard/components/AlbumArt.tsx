import { useContext, useEffect, useState } from "preact/hooks";
import { MediocreMassiveMediaPlayerCardConfig } from "../";
import styled from "styled-components";
import { CardContext, CardContextType } from "../../../utils";
import { Vibrant } from "node-vibrant/browser";
import { Icon } from "../../Icon";
import { Fragment } from "preact/jsx-runtime";

const ImgOuter = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
`;

const ImgWrap = styled.div<{
  shadowColor?: string;
}>`
  position: relative;
  aspect-ratio: 1;
  max-height: 95%;
  overflow: hidden;
  border-radius: 8px;
  align-self: center;
  margin-top: 8px;
  margin-bottom: 8px;
  ${(props) =>
    props.shadowColor ? `box-shadow: 0px 0px 8px ${props.shadowColor};` : ""}
`;

const Img = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
`;

const NoAlbumArt = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  aspect-ratio: 1;
  color: var(--card-background-color);
  background-color: var(--primary-text-color);
  opacity: 0.5;
`;

const SourceIndicator = styled.div<{ contrastColor?: string }>`
  position: absolute;
  bottom: 6px;
  right: 6px;
  color: var(--primary-text-color);
  ${(props) => (props.contrastColor ? `color: ${props.contrastColor};` : "")}
  opacity: 0.8;
`;

export const AlbumArt = () => {
  const { hass, config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );
  const { entity_id } = config;
  const player = hass.states[entity_id];
  const {
    media_title: title,
    media_artist: artist,
    entity_picture: albumArt,
    source,
  } = player.attributes;
  const state = player.state;
  // State for average color
  const [averageColor, setAverageColor] = useState<string | null>(null);
  const [contrastColor, setContrastColor] = useState<string | null>(null);

  // Reset average color when album art changes
  useEffect(() => {
    setAverageColor(null);
  }, [albumArt]);

  // Handle image load to calculate average color
  const handleImageLoad = () => {
    if (albumArt) {
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
      Vibrant.from(albumArt)
        .getPalette()
        .then((palette) => {
          if (palette.DarkVibrant && palette.LightVibrant) {
            setAverageColor(
              isDarkMode ? palette.DarkVibrant.hex : palette.LightVibrant.hex
            ); // Use the vibrant color
            setContrastColor(
              isDarkMode
                ? palette.DarkVibrant.bodyTextColor
                : palette.LightVibrant.bodyTextColor
            );
          } else if (palette.DarkMuted && palette.LightMuted) {
            setAverageColor(
              isDarkMode ? palette.DarkMuted.hex : palette.LightMuted.hex
            ); // Fallback to a muted color
            setContrastColor(
              isDarkMode
                ? palette.DarkMutedt.bodyTextColor
                : palette.DarkMuted.bodyTextColor
            );
          } else {
            setAverageColor(undefined); // Default fallback color
          }
        })
        .catch((e) => {
          console.error("Error getting color with Vibrant:", e);
        });
    }
  };
  return (
    <ImgOuter>
      <ImgWrap shadowColor={averageColor}>
        {!!albumArt ? (
          <Fragment>
            <Img
              src={albumArt}
              alt={`${title} by ${artist}`}
              onLoad={handleImageLoad}
            />
            <SourceIndicator contrastColor={contrastColor}>
              <Icon size="xx-small" Icon={getIcon({ source, state })} />
            </SourceIndicator>
          </Fragment>
        ) : (
          <NoAlbumArt>
            <Icon size="x-large" Icon={getIcon({ source, state })} />
          </NoAlbumArt>
        )}
      </ImgWrap>
    </ImgOuter>
  );
};

const getIcon = ({ source, state }: { source: string; state: string }) => {
  if (state === "off") return "mdi:power-off";
  switch (source?.toLowerCase()) {
    case "spotify":
      return "mdi:spotify";
    case "airplay":
      return "mdi:airplay";
    case "bluetooth":
      return "mdi:bluetooth";
    case "net radio":
      return "mdi:radio";
    case "server":
      return "mdi:server";
    case "usb":
      return "mdi:usb";
    case "aux":
      return "mdi:audio-input-rca";
    case "hdmi":
      return "mdi:hdmi-port";
    case "tv":
      return "mdi:television";
    case "tuner":
      return "mdi:radio-tower";
    case "optical":
      return "mdi:audio-input-stereo-minijack";
    default:
      return "mdi:music";
  }
};
