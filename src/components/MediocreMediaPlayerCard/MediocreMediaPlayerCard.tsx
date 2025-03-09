import { fireEvent } from "custom-card-helpers"
import { MediocreMediaPlayerCardUi } from "./MediocreMediaPlayerCardUi"
import { CardContext, CardContextType } from "../../utils"
import { useContext } from "preact/hooks"

export type MediocreMediaPlayerCardConfig = {
    entity_id: string
}

export const MediocreMediaPlayerCard = () => {
    const { hass, config, rootElement } = useContext<CardContextType<MediocreMediaPlayerCardConfig>>(CardContext)
    const { entity_id } = config

    // Get the media player entity from hass
    const entity = hass.states[entity_id]

    if (!entity) {
        return <div>Entity {entity_id} not found</div>
    }

    // Extract state and attributes
    const { state, attributes } = entity

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
    } = attributes

    // Determine if the player is on
    const isOn = !["off", "unavailable"].includes(state)

    // Determine if the player is playing
    const isPlaying = state === "playing"

    // Get album art (try media_album_art first, then entity_picture, then default)
    const albumArt = media_album_art || entity_picture || null

    // Get title and artist (with fallbacks)
    const title = media_title || attributes.friendly_name || entity_id
    const artist = media_artist || ""

    // Get volume (convert from 0-100 to 0-1 if needed)
    const volume = is_volume_muted ? 0 : volume_level || 0

    // Map repeat to our expected values
    const repeatMode = (() => {
        if (repeat === "one" || repeat === "one_shot") return "one"
        if (repeat === "all") return "all"
        return "off"
    })()

    // Handle play/pause
    const handlePlayPause = () => {
        if (!isOn) return

        const service = isPlaying ? "media_pause" : "media_play"
        hass.callService("media_player", service, {
            entity_id,
        })
    }

    // Handle next track
    const handleNext = () => {
        if (!isOn) return

        hass.callService("media_player", "media_next_track", {
            entity_id,
        })
    }

    // Handle previous track
    const handlePrevious = () => {
        if (!isOn) return

        hass.callService("media_player", "media_previous_track", {
            entity_id,
        })
    }

    // Handle volume change
    const handleVolumeChange = (newVolume: number) => {
        if (!isOn) return

        // If volume was muted and is now > 0, unmute
        if (is_volume_muted && newVolume > 0) {
            hass.callService("media_player", "volume_mute", {
                entity_id,
                is_volume_muted: false,
            })
        }

        // Set the volume level
        hass.callService("media_player", "volume_set", {
            entity_id,
            volume_level: newVolume,
        })
    }

    // Handle more info
    const handleMoreInfo = () => {
        // Use fireEvent from custom-card-helpers to show more info dialog
        console.log('fireEvent', rootElement, "hass-more-info",);
        fireEvent(rootElement, "hass-more-info", {
            entityId: entity_id,
        }
        );
    }

    // Handle shuffle toggle
    const handleToggleShuffle = () => {
        if (!isOn) return

        hass.callService("media_player", "shuffle_set", {
            entity_id,
            shuffle: !shuffle,
        })
    }

    // Handle repeat change
    const handleChangeRepeat = () => {
        if (!isOn) return

        let newRepeat: string

        // Cycle through repeat modes: off -> all -> one -> off
        if (repeatMode === "off") newRepeat = "all"
        else if (repeatMode === "all") newRepeat = "one"
        else newRepeat = "off"

        hass.callService("media_player", "repeat_set", {
            entity_id,
            repeat: newRepeat,
        })
    }

    // Handle mute toggle
    const handleMuteToggle = () => {
        if (!isOn) return

        hass.callService("media_player", "volume_mute", {
            entity_id,
            is_volume_muted: !is_volume_muted,
        })
    }

    return (
        <MediocreMediaPlayerCardUi
            isPlaying={isPlaying}
            albumArt={albumArt}
            title={title}
            artist={artist}
            volume={volume}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onVolumeChanged={handleVolumeChange}
            onToggleMute={handleMuteToggle}
            isOn={isOn}
            onMoreInfo={handleMoreInfo}
            shuffle={shuffle}
            onToggleShuffle={handleToggleShuffle}
            repeat={repeatMode}
            onChangeRepeat={handleChangeRepeat}
            friendlyName={friendly_name}
        />
    )
}

