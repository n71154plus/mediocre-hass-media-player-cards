import { useCallback, useContext, useMemo } from "preact/hooks";
import {
  IconButton,
  Slider,
  usePlayer,
  CardContext,
  CardContextType,
} from "@components";
import { getHass, getVolumeIcon } from "@utils";
import type { MediocreMassiveMediaPlayerCardConfig } from "@types";
import { css } from "@emotion/react";

const styles = {
  root: css({
    display: "flex",
    alignItems: "center",
    flex: 1,
    maxHeight: "36px",
    marginTop: "auto",
    gap: "8px",
  }),
  buttonMuted: css({
    opacity: 0.8,
  }),
};

export const VolumeController = () => {
  const { config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );
  const volumeControl = config.options?.volume_control ?? "slider";

  const player = usePlayer();

  const entity_id = player.entity_id;
  const volume = player.attributes?.volume_level ?? 0;
  const volumeMuted = player.attributes?.is_volume_muted ?? false;

  // Handle volume change
  const handleVolumeChange = useCallback((newVolume: number) => {
    // Set the volume level
    getHass().callService("media_player", "volume_set", {
      entity_id,
      volume_level: newVolume,
    });
  }, []);

  // Handle mute toggle
  const handleToggleMute = useCallback(() => {
    getHass().callService("media_player", "volume_mute", {
      entity_id,
      is_volume_muted: !volumeMuted,
    });
  }, [volumeMuted]);

  const VolumeIcon = useMemo(
    () => getVolumeIcon(volume, volumeMuted),
    [volume, volumeMuted]
  );

  const handleVolumeUp = useCallback(() => {
    const newVolume = Math.min(volume + 0.05, 1);
    handleVolumeChange(newVolume);
  }, [volume, handleVolumeChange]);

  const handleVolumeDown = useCallback(() => {
    const newVolume = Math.max(volume - 0.05, 0);
    handleVolumeChange(newVolume);
  }, [volume, handleVolumeChange]);

  return (
    <div css={styles.root}>
      <IconButton
        css={volumeMuted ? styles.buttonMuted : {}}
        size="small"
        onClick={handleToggleMute}
        icon={VolumeIcon}
      />
      {volumeControl === "buttons" ? (
        <>
          <IconButton
            size="small"
            onClick={handleVolumeDown}
            icon={"mdi:minus"}
          />
          <IconButton size="small" onClick={handleVolumeUp} icon={"mdi:plus"} />
        </>
      ) : (
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={volume}
          sliderSize={"large"}
          onChange={handleVolumeChange}
        />
      )}
    </div>
  );
};

export const VolumeTrigger = ({ onClick }: { onClick: () => void }) => {
  const player = usePlayer();

  const volume = player.attributes?.volume_level ?? 0;
  const volumeMuted = player.attributes?.is_volume_muted ?? false;
  const volumeIcon = getVolumeIcon(volume, volumeMuted);

  return <IconButton size="small" onClick={onClick} icon={volumeIcon} />;
};
