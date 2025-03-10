import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import styled from "styled-components";
import PauseCircleIcon from "mdi-preact/PauseCircleIcon";
import PlayCircleIcon from "mdi-preact/PlayCircleIcon";
import SkipPreviousIcon from "mdi-preact/SkipPreviousIcon";
import SkipNextIcon from "mdi-preact/SkipNextIcon";
import ShuffleVariantIcon from "mdi-preact/ShuffleVariantIcon";
import ShuffleDisabledIcon from "mdi-preact/ShuffleDisabledIcon";
import RepeatOnceIcon from "mdi-preact/RepeatOnceIcon";
import RepeatIcon from "mdi-preact/RepeatIcon";
import RepeatOffIcon from "mdi-preact/RepeatOffIcon";
import { IconButton } from "../../IconButton";
import { CardContext, CardContextType } from "../../../utils";
import { MediocreMediaPlayerCardConfig } from "../config";
import VolumeOffIcon from "mdi-preact/VolumeOffIcon";
import VolumeMediumIcon from "mdi-preact/VolumeMediumIcon";
import VolumeHighIcon from "mdi-preact/VolumeHighIcon";
import ChevronLeftIcon from "mdi-preact/ChevronLeftIcon";
import { Fragment } from "preact/jsx-runtime";
import { Slider } from "../../Slider";

const PlaybackControlsWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: auto;
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
    if (volume === 0 || volumeMuted) return VolumeOffIcon;
    if (volume < 0.5) return VolumeMediumIcon;
    return VolumeHighIcon;
  }, [volume, volumeMuted]);

  return (
    <PlaybackControlsWrap>
      {!showVolumeSlider ? (
        <Fragment>
          <ControlButton
            size="x-small"
            onClick={toggleShuffle}
            muted={!shuffle}
            Icon={shuffle ? ShuffleVariantIcon : ShuffleDisabledIcon}
          />
          <ControlButton
            size="small"
            onClick={previousTrack}
            Icon={SkipPreviousIcon}
          />
          <ControlButton
            size="small"
            onClick={togglePlayback}
            Icon={playing ? PauseCircleIcon : PlayCircleIcon}
          />
          <ControlButton size="small" onClick={nextTrack} Icon={SkipNextIcon} />
          <ControlButton
            size="x-small"
            onClick={toggleRepeat}
            muted={repeat === "off"}
            Icon={
              repeat === "one"
                ? RepeatOnceIcon
                : repeat === "all"
                ? RepeatIcon
                : RepeatOffIcon
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
            Icon={ChevronLeftIcon}
          />
        )}
      </VolumeTriggerWrap>
    </PlaybackControlsWrap>
  );
};
