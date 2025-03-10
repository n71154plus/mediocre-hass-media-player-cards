import { fireEvent } from "custom-card-helpers";
import styled from "styled-components";
import { CardContext, type CardContextType } from "../../utils";
import { useContext } from "preact/hooks";

// Import MDI icons
import PlayIcon from "mdi-preact/PlayIcon";
import PauseIcon from "mdi-preact/PauseIcon";
import SkipPreviousIcon from "mdi-preact/SkipPreviousIcon";
import SkipNextIcon from "mdi-preact/SkipNextIcon";
import ShuffleIcon from "mdi-preact/ShuffleIcon";
import RepeatIcon from "mdi-preact/RepeatIcon";
import RepeatOnceIcon from "mdi-preact/RepeatOnceIcon";
import VolumeOffIcon from "mdi-preact/VolumeOffIcon";
import VolumeLowIcon from "mdi-preact/VolumeLowIcon";
import VolumeMediumIcon from "mdi-preact/VolumeMediumIcon";
import VolumeHighIcon from "mdi-preact/VolumeHighIcon";
import MusicNoteIcon from "mdi-preact/MusicNoteIcon";

// Styled Components
const Card = styled.div`
  background: var(--card-background-color, #121212);
  border-radius: 12px;
  overflow: hidden;
  color: var(--primary-text-color, #ffffff);
  font-family: var(
    --paper-font-body1_-_font-family,
    "Roboto",
    "Noto",
    sans-serif
  );
  box-shadow: var(
    --ha-card-box-shadow,
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2)
  );
`;

const AlbumArtContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  background: var(--secondary-background-color, #333);
  overflow: hidden;
`;

const AlbumArt = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const NoAlbumArt = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--secondary-background-color, #333);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 40%;
    height: 40%;
    opacity: 0.5;
  }
`;

const ContentContainer = styled.div`
  padding: 16px;
`;

const MediaInfo = styled.div`
  margin-bottom: 16px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Artist = styled.div`
  font-size: 14px;
  color: var(--secondary-text-color, #b3b3b3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const MainControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const SecondaryControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const IconButton = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: ${(props) =>
    props.active
      ? "var(--primary-color, #03a9f4)"
      : "var(--secondary-text-color, #b3b3b3)"};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary-text-color, #ffffff);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      color: var(--secondary-text-color, #b3b3b3);
      transform: none;
    }
  }
`;

const PlayButton = styled(IconButton)`
  background-color: var(--primary-color, #03a9f4);
  color: var(--text-primary-color, #ffffff);
  width: 40px;
  height: 40px;

  &:hover {
    background-color: var(--primary-color, #03a9f4);
    transform: scale(1.05);
    color: var(--text-primary-color, #ffffff);
  }

  &:disabled {
    background-color: var(--disabled-text-color, #bdbdbd);

    &:hover {
      background-color: var(--disabled-text-color, #bdbdbd);
    }
  }
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: var(--secondary-background-color, #535353);
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary-color, #03a9f4);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  &::-webkit-slider-thumb:hover {
    background: var(--primary-color, #03a9f4);
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary-color, #03a9f4);
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
  }

  &::-moz-range-thumb:hover {
    background: var(--primary-color, #03a9f4);
  }
`;

const ProgressContainer = styled.div``;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: var(--secondary-background-color, #535353);
  overflow: hidden;
  position: relative;
`;

const Progress = styled.div<{ width: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${(props) => props.width}%;
  transition: width 1s linear;
  background: var(--primary-color, #03a9f4);
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
`;

export type MediocreModernMediaPlayerCardConfig = {
  entity_id: string;
};

export const MediocreModernMediaPlayerCard = () => {
  // hass is the homeassistant instance, config is the card config, rootElement is the card root element
  const { hass, config, rootElement } =
    useContext<CardContextType<MediocreModernMediaPlayerCardConfig>>(
      CardContext
    );
  const { entity_id } = config;

  // Get the media player entity from hass
  const entity = hass.states[entity_id];

  if (!entity) {
    return <div>Entity {entity_id} not found</div>;
  }

  // Extract state and attributes
  const { state, attributes } = entity;

  const {
    media_title,
    media_artist,
    media_album_art,
    entity_picture,
    volume_level = 0,
    is_volume_muted = false,
    shuffle = false,
    repeat = "off",
    friendly_name,
    media_position,
    media_duration,
  } = attributes;

  // Determine if the player is on
  const isOn = !["off", "unavailable"].includes(state);

  // Determine if the player is playing
  const isPlaying = state === "playing";

  // Get album art (try media_album_art first, then entity_picture, then default)
  const albumArt = media_album_art || entity_picture || null;

  // Get title and artist (with fallbacks)
  const title = media_title || attributes.friendly_name || entity_id;
  const artist = media_artist || "";

  // Get volume (convert from 0-100 to 0-1 if needed)
  const volume = is_volume_muted ? 0 : volume_level || 0;

  // Map repeat to our expected values
  const repeatMode = (() => {
    if (repeat === "one" || repeat === "one_shot") return "one";
    if (repeat === "all") return "all";
    return "off";
  })();

  // Calculate progress percentage
  const progressPercentage =
    media_position && media_duration
      ? (media_position / media_duration) * 100
      : 0;

  // Handle play/pause
  const handlePlayPause = () => {
    if (!isOn) return;

    const service = isPlaying ? "media_pause" : "media_play";
    hass.callService("media_player", service, {
      entity_id,
    });
  };

  // Handle next track
  const handleNext = () => {
    if (!isOn) return;

    hass.callService("media_player", "media_next_track", {
      entity_id,
    });
  };

  // Handle previous track
  const handlePrevious = () => {
    if (!isOn) return;

    hass.callService("media_player", "media_previous_track", {
      entity_id,
    });
  };

  // Handle volume change
  const handleVolumeChange = (e: Event) => {
    if (!isOn) return;

    const target = e.target as HTMLInputElement;
    const newVolume = Number.parseFloat(target.value);

    // If volume was muted and is now > 0, unmute
    if (is_volume_muted && newVolume > 0) {
      hass.callService("media_player", "volume_mute", {
        entity_id,
        is_volume_muted: false,
      });
    }

    // Set the volume level
    hass.callService("media_player", "volume_set", {
      entity_id,
      volume_level: newVolume,
    });
  };

  // Handle more info
  const handleMoreInfo = () => {
    // Use fireEvent from custom-card-helpers to show more info dialog
    fireEvent(rootElement, "hass-more-info", {
      entityId: entity_id,
    });
  };

  // Handle shuffle toggle
  const handleToggleShuffle = () => {
    if (!isOn) return;

    hass.callService("media_player", "shuffle_set", {
      entity_id,
      shuffle: !shuffle,
    });
  };

  // Handle repeat change
  const handleChangeRepeat = () => {
    if (!isOn) return;

    let newRepeat: string;

    // Cycle through repeat modes: off -> all -> one -> off
    if (repeatMode === "off") newRepeat = "all";
    else if (repeatMode === "all") newRepeat = "one";
    else newRepeat = "off";

    hass.callService("media_player", "repeat_set", {
      entity_id,
      repeat: newRepeat,
    });
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    if (!isOn) return;

    hass.callService("media_player", "volume_mute", {
      entity_id,
      is_volume_muted: !is_volume_muted,
    });
  };

  return (
    <Card onClick={handleMoreInfo}>
      <AlbumArtContainer>
        {albumArt ? (
          <AlbumArt src={albumArt} alt={title} />
        ) : (
          <NoAlbumArt>
            <MusicNoteIcon size={48} />
          </NoAlbumArt>
        )}
      </AlbumArtContainer>
      <ProgressContainer>
        <ProgressBar>
          <Progress width={progressPercentage} />
        </ProgressBar>
      </ProgressContainer>
      <ContentContainer onClick={(e) => e.stopPropagation()}>
        <MediaInfo>
          <Title>{title}</Title>
          <Artist>{artist}</Artist>
        </MediaInfo>

        <Controls>
          <SecondaryControls>
            <IconButton
              active={shuffle}
              onClick={handleToggleShuffle}
              disabled={!isOn}
              aria-label="Shuffle"
            >
              <ShuffleIcon size={20} />
            </IconButton>

            <IconButton
              onClick={handlePrevious}
              disabled={!isOn}
              aria-label="Previous"
            >
              <SkipPreviousIcon size={24} />
            </IconButton>
          </SecondaryControls>

          <MainControls>
            <PlayButton
              onClick={handlePlayPause}
              disabled={!isOn}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
            </PlayButton>
          </MainControls>

          <SecondaryControls>
            <IconButton onClick={handleNext} disabled={!isOn} aria-label="Next">
              <SkipNextIcon size={24} />
            </IconButton>

            <IconButton
              active={repeatMode !== "off"}
              onClick={handleChangeRepeat}
              disabled={!isOn}
              aria-label="Repeat"
            >
              {repeatMode === "one" ? (
                <RepeatOnceIcon size={20} />
              ) : (
                <RepeatIcon size={20} />
              )}
            </IconButton>
          </SecondaryControls>
        </Controls>

        <VolumeContainer>
          <IconButton
            onClick={handleMuteToggle}
            disabled={!isOn}
            aria-label={is_volume_muted ? "Unmute" : "Mute"}
          >
            {is_volume_muted || volume === 0 ? (
              <VolumeOffIcon size={20} />
            ) : volume < 0.3 ? (
              <VolumeLowIcon size={20} />
            ) : volume < 0.7 ? (
              <VolumeMediumIcon size={20} />
            ) : (
              <VolumeHighIcon size={20} />
            )}
          </IconButton>
          <VolumeSlider
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            disabled={!isOn}
            aria-label="Volume"
          />
        </VolumeContainer>
      </ContentContainer>
    </Card>
  );
};
