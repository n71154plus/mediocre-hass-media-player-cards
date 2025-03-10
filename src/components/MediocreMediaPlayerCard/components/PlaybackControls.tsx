import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import styled from "styled-components";
import { IconButton } from "../../IconButton";
import { CardContext, CardContextType } from "../../../utils";
import { MediocreMediaPlayerCardConfig } from "../config";
import { Fragment } from "preact/jsx-runtime";
import { Slider } from "../../Slider";

const PlaybackControlsWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: auto;
  height: 36px; // fixed to prevent jumping
  margin-left: -4px; // compensate for icon button padding
`;

const VolumeTriggerWrap = styled.div`
  margin-left: auto;
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  transition: all 0.3s ease;
`;

const ControlButton = styled(IconButton)<{ muted?: boolean }>`
  opacity: ${(props) => (props.muted ? 0.8 : 1)}; // reduce opacity if muted
`;

export const PlaybackControls = () => {
  const { hass, config } =
    useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext);
  const { entity_id } = config;
  const player = hass.states[entity_id];

  const playing = player.state === "playing";
  const shuffle = player.attributes?.shuffle ?? false;
  const repeat: "one" | "all" | "off" = player.attributes?.repeat ?? "off";
  const volume = player.attributes?.volume_level ?? 0;
  const volumeMuted = player.attributes?.is_volume_muted ?? false;

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const togglePlayback = useCallback(() => {
    hass.callService("media_player", "media_play_pause", {
      entity_id: config.entity_id,
    });
  }, []);

  const nextTrack = useCallback(() => {
    hass.callService("media_player", "media_next_track", {
      entity_id: config.entity_id,
    });
  }, []);

  const previousTrack = useCallback(() => {
    hass.callService("media_player", "media_previous_track", {
      entity_id: config.entity_id,
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    hass.callService("media_player", "shuffle_set", {
      entity_id: config.entity_id,
      shuffle: !shuffle,
    });
  }, [shuffle]);

  const toggleRepeat = useCallback(() => {
    const newRepeat =
      repeat === "off" ? "one" : repeat === "one" ? "all" : "off";
    hass.callService("media_player", "repeat_set", {
      entity_id: config.entity_id,
      repeat: newRepeat,
    });
  }, [repeat]);

  // Handle volume change
  const handleVolumeChange = useCallback((newVolume: number) => {
    // Set the volume level
    hass.callService("media_player", "volume_set", {
      entity_id,
      volume_level: newVolume,
    });
  }, []);

  // Handle mute toggle
  const handleToggleMute = useCallback(() => {
    hass.callService("media_player", "volume_mute", {
      entity_id,
      is_volume_muted: !volumeMuted,
    });
  }, [volumeMuted]);

  const VolumeIcon = useMemo(() => {
    if (volume === 0 || volumeMuted) return "mdi:volume-off";
    if (volume < 0.5) return "mdi:volume-medium";
    return "mdi:volume-high";
  }, [volume, volumeMuted]);

  return (
    <PlaybackControlsWrap>
      {!showVolumeSlider ? (
        <Fragment>
          <ControlButton
            size="x-small"
            onClick={toggleShuffle}
            muted={!shuffle}
            Icon={shuffle ? "mdi:shuffle-variant" : "mdi:shuffle-disabled"}
          />
          <ControlButton
            size="small"
            onClick={previousTrack}
            Icon={"mdi:skip-previous"}
          />
          <ControlButton
            size="medium"
            onClick={togglePlayback}
            Icon={playing ? "mdi:pause-circle" : "mdi:play-circle"}
          />
          <ControlButton
            size="small"
            onClick={nextTrack}
            Icon={"mdi:skip-next"}
          />
          <ControlButton
            size="x-small"
            onClick={toggleRepeat}
            muted={repeat === "off"}
            Icon={
              repeat === "one"
                ? "mdi:repeat-once"
                : repeat === "all"
                ? "mdi:repeat"
                : "mdi:repeat-off"
            }
          />
        </Fragment>
      ) : (
        <VolumeContainer>
          <ControlButton
            size="small"
            onClick={handleToggleMute}
            Icon={VolumeIcon}
          />

          <Slider
            min={0}
            max={1}
            step={0.01}
            value={volume}
            thumbSize={"small"}
            onChange={handleVolumeChange}
          />
        </VolumeContainer>
      )}
      <VolumeTriggerWrap>
        {!showVolumeSlider ? (
          <ControlButton
            size="small"
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            Icon={VolumeIcon}
          />
        ) : (
          <ControlButton
            size="small"
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            Icon={"mdi:chevron-left"}
          />
        )}
      </VolumeTriggerWrap>
    </PlaybackControlsWrap>
  );
};
