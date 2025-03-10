import { useState, useEffect, useContext, useCallback } from "preact/hooks";
import styled from "styled-components";
import { Vibrant } from "node-vibrant/browser";
import DiscIcon from "mdi-preact/DiscIcon";
import { CardContext, CardContextType } from "../../../utils";
import { MediocreMediaPlayerCardConfig } from "../config";
import { fireEvent } from "custom-card-helpers";

const AlbumArtContainer = styled.div<{ shadowColor?: string }>`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  ${(props) =>
    props.shadowColor
      ? `box-shadow: 0px 0px 80px ${props.shadowColor}, 170px 50px 120px ${props.shadowColor}40, 300px -50px 150px ${props.shadowColor}40;`
      : ""}
`;

const AlbumArtImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NoAlbumArt = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: var(--card-background-color);
  background-color: var(--primary-text-color);
  opacity: 0.5;
`;

// Component
export const AlbumArt = () => {
  const { hass, config, rootElement } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { entity_id } = config;
  const {
    media_title: title,
    media_artist: artist,
    entity_picture: albumArt,
  } = hass.states[entity_id].attributes;
  // State for average color
  const [averageColor, setAverageColor] = useState<string | null>(null);

  // Reset average color when album art changes
  useEffect(() => {
    setAverageColor(null);
  }, [albumArt]);

  // Handle image load to calculate average color
  const handleImageLoad = () => {
    if (albumArt) {
      Vibrant.from(albumArt)
        .getPalette()
        .then((palette) => {
          if (palette.Muted) {
            setAverageColor(palette.Muted.hex); // Use the vibrant color
          } else if (palette.Vibrant) {
            setAverageColor(palette.Vibrant.hex); // Fallback to a muted color
          } else {
            setAverageColor("#888"); // Default fallback color
          }
        })
        .catch((e) => {
          console.error("Error getting color with Vibrant:", e);
        });
    }
  };

  const handleMoreInfo = useCallback(() => {
    fireEvent(rootElement, "hass-more-info", {
      entityId: entity_id,
    });
  }, []);

  return (
    <AlbumArtContainer onClick={handleMoreInfo} shadowColor={averageColor}>
      {!!albumArt ? (
        <AlbumArtImage
          src={albumArt}
          alt={`${title} by ${artist}`}
          onLoad={handleImageLoad}
        />
      ) : (
        <NoAlbumArt>
          <DiscIcon size={24} />
        </NoAlbumArt>
      )}
    </AlbumArtContainer>
  );
};
