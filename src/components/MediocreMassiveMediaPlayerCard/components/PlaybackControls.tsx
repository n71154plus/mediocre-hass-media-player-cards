import { useCallback, useContext } from "preact/hooks";
import { MediocreMassiveMediaPlayerCardContext } from "../MediocreMassiveMediaPlayerCard";
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

const PlaybackControlsWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const PlaybackControls = () => {
  const { hass, config } = useContext(MediocreMassiveMediaPlayerCardContext);
  const playing = hass.states[config.entity_id].state === "playing";
  const shuffle = hass.states[config.entity_id].attributes?.shuffle ?? false;
  const repeat: "one" | "all" | "off" =
    hass.states[config.entity_id].attributes?.repeat ?? "off";

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

  return (
    <PlaybackControlsWrap>
      <IconButton
        size="small"
        onClick={toggleShuffle}
        Icon={shuffle ? ShuffleVariantIcon : ShuffleDisabledIcon}
      />
      <IconButton
        size="medium"
        onClick={previousTrack}
        Icon={SkipPreviousIcon}
      />
      <IconButton
        size="large"
        onClick={togglePlayback}
        Icon={playing ? PauseCircleIcon : PlayCircleIcon}
      />
      <IconButton size="medium" onClick={nextTrack} Icon={SkipNextIcon} />
      <IconButton
        size="small"
        onClick={toggleRepeat}
        Icon={
          repeat === "one"
            ? RepeatOnceIcon
            : repeat === "all"
            ? RepeatIcon
            : RepeatOffIcon
        }
      />
    </PlaybackControlsWrap>
  );
};
