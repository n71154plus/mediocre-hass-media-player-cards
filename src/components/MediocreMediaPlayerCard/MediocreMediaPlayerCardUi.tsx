import { useState, useEffect, useRef } from "preact/hooks"
import styled from "styled-components"
import { Vibrant } from "node-vibrant/browser"

// Import icons individually
import PlayIcon from "mdi-preact/PlayIcon"
import PauseIcon from "mdi-preact/PauseIcon"
import SkipNextIcon from "mdi-preact/SkipNextIcon"
import SkipPreviousIcon from "mdi-preact/SkipPreviousIcon"
import VolumeHighIcon from "mdi-preact/VolumeHighIcon"
import VolumeMediumIcon from "mdi-preact/VolumeMediumIcon"
import VolumeLowIcon from "mdi-preact/VolumeLowIcon"
import VolumeOffIcon from "mdi-preact/VolumeOffIcon"
import ShuffleIcon from "mdi-preact/ShuffleIcon"
import RepeatIcon from "mdi-preact/RepeatIcon"
import RepeatOnceIcon from "mdi-preact/RepeatOnceIcon"
import ChevronLeftIcon from "mdi-preact/ChevronLeftIcon"
import { Slider } from "../Slider"
import DotsVerticalIcon from "mdi-preact/DotsVerticalIcon"

// Types
interface MediocreMediaPlayerCardProps {
  isPlaying: boolean
  albumArt?: string
  title: string
  artist: string
  volume: number
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onVolumeChanged: (volume: number) => void
  onToggleMute: () => void
  isOn: boolean
  onMoreInfo: () => void
  shuffle?: boolean
  onToggleShuffle?: () => void
  repeat?: "off" | "all" | "one"
  onChangeRepeat?: () => void
  friendlyName?: string
}

// Styled components using Home Assistant CSS variables
const CardContent = styled.div<{ isOn: boolean; shadowColor?: string }>`
  display: flex;
  gap: 16px;
  padding: 16px;
  opacity: ${(props) => (props.isOn ? 1 : 0.7)};
  transition: opacity 0.3s ease;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  ${(props) => (props.shadowColor ? `background-color: ${props.shadowColor}05;` : "")}
`

const AlbumArtContainer = styled.div<{ shadowColor?: string }>`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.3s ease;
  ${(props) => (props.shadowColor ? `box-shadow: 0px 0px 80px ${props.shadowColor}10;` : "")}
`

const AlbumArt = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const TitleText = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--primary-text-color, #333);
`

const ArtistText = styled.p`
  margin: 0px;
  font-size: 14px;
  color: var(--secondary-text-color, #666);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const FriendlyNameText = styled.span`
  font-size: 11px;
  color: var(--secondary-text-color, #888);
  opacity: 0.8;
  font-style: italic;
`

const Controls = styled.div`
  display: flex;
  align-items: center;
  margin-top: auto;
`

const ControlButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  transition: background-color 0.2s;
  color: ${(props) => (props.disabled ? "var(--disabled-text-color, #999)" : "var(--primary-text-color, #333)")};
  
  &:hover {
    background-color: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
  }
  
  &:active {
    background-color: var(--divider-color, rgba(0, 0, 0, 0.1));
  }
`

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  transition: all 0.3s ease;
`

const InfoButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  margin-left: 8px;
  transition: background-color 0.2s;
  color: var(--primary-text-color, #4a90e2);
  
  &:hover {
    background-color: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
  }
  
  &:active {
    background-color: var(--divider-color, rgba(0, 0, 0, 0.1));
  }
`

const ShuffleButton = styled(ControlButton)<{ active: boolean }>`
  color: ${(props) => (props.active ? "var(--primary-color, #4a90e2)" : props.disabled ? "var(--disabled-text-color, #999)" : "var(--primary-text-color, #333)")};
`

const RepeatButton = styled(ControlButton)<{ active: boolean }>`
  color: ${(props) => (props.active ? "var(--primary-color, #4a90e2)" : props.disabled ? "var(--disabled-text-color, #999)" : "var(--primary-text-color, #333)")};
`

const VolumeIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  transition: background-color 0.2s;
  color: ${(props) => (props.disabled ? "var(--disabled-text-color, #999)" : "var(--primary-text-color, #333)")};
  
  &:hover {
    background-color: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
  }
  
  &:active {
    background-color: var(--divider-color, rgba(0, 0, 0, 0.1));
  }
`

// Component
export const MediocreMediaPlayerCardUi = ({
  isPlaying,
  albumArt,
  title,
  artist,
  volume,
  onPlayPause,
  onNext,
  onPrevious,
  onVolumeChanged,
  onToggleMute,
  isOn,
  onMoreInfo,
  shuffle = false,
  onToggleShuffle = () => {},
  repeat = "off",
  onChangeRepeat = () => {},
  friendlyName,
}: MediocreMediaPlayerCardProps) => {
  // State for showing/hiding volume slider
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  // State for average color
  const [averageColor, setAverageColor] = useState<string | null>(null)
  // Reference to the image element
  const imageRef = useRef<HTMLImageElement | null>(null)

  // Reset average color when album art changes
  useEffect(() => {
    setAverageColor(null)
  }, [albumArt])

  // Toggle volume slider visibility
  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider)
  }

  // Helper function to determine volume icon
  const VolumeIcon = () => {
    const color = isOn ? "var(--primary-text-color, #333)" : "var(--disabled-text-color, #999)"
    if (volume === 0) return <VolumeOffIcon size={18} color={color} />
    if (volume < 0.33) return <VolumeLowIcon size={18} color={color} />
    if (volume < 0.66) return <VolumeMediumIcon size={18} color={color} />
    return <VolumeHighIcon size={18} color={color} />
  }

  // Helper function to determine repeat icon
  const RepeatIconComponent = () => {
    if (repeat === "one") return <RepeatOnceIcon size={18} />
    return <RepeatIcon size={18} />
  }

  // Handle toggle mute
  const handleToggleMute = () => {
    if (isOn) {
      // Toggle mute state
      onToggleMute()
    }
  }

  // Handle image load to calculate average color
  const handleImageLoad = () => {
    if (albumArt) {
      Vibrant.from(albumArt)
        .getPalette()
        .then((palette) => {
          if (palette.Vibrant) {
            setAverageColor(palette.Vibrant.hex) // Use the vibrant color
          } else if (palette.Muted) {
            setAverageColor(palette.Muted.hex) // Fallback to a muted color
          } else {
            setAverageColor("#888") // Default fallback color
          }
        })
        .catch((e) => {
          console.error("Error getting color with Vibrant:", e)
        })
    }
  }

  return (
    // @ts-ignore - ha-card is a custom element from Home Assistant
    <ha-card>
      <CardContent isOn={isOn} shadowColor={averageColor}>
        {!!albumArt && (
          <AlbumArtContainer shadowColor={averageColor}>
            <AlbumArt ref={imageRef} src={albumArt} alt={`${title} by ${artist}`} onLoad={handleImageLoad} />
          </AlbumArtContainer>
        )}

        <ContentContainer>
          <TitleText>{title}</TitleText>
          <ArtistText>{artist}</ArtistText>
          {friendlyName && title !== friendlyName && <FriendlyNameText>{friendlyName}</FriendlyNameText>}

          <Controls>
            {showVolumeSlider ? (
              <>
                <ControlButton onClick={toggleVolumeSlider} disabled={!isOn} title="Back to controls">
                  <ChevronLeftIcon size={18} />
                </ControlButton>

                <VolumeContainer>
                  <VolumeIconButton
                    onClick={handleToggleMute}
                    disabled={!isOn}
                    title={volume === 0 ? "Unmute" : "Mute"}
                  >
                    <VolumeIcon />
                  </VolumeIconButton>
                  <Slider min={0} max={1} step={0.01} value={volume} thumbSize={"small"} onChange={onVolumeChanged} />
                </VolumeContainer>
              </>
            ) : (
              <>
                <ShuffleButton onClick={onToggleShuffle} disabled={!isOn} title="Shuffle" active={shuffle}>
                  <ShuffleIcon size={18} />
                </ShuffleButton>

                <ControlButton onClick={onPrevious} disabled={!isOn} title="Previous">
                  <SkipPreviousIcon size={24} />
                </ControlButton>

                <ControlButton onClick={onPlayPause} disabled={!isOn} title={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
                </ControlButton>

                <ControlButton onClick={onNext} disabled={!isOn} title="Next">
                  <SkipNextIcon size={24} />
                </ControlButton>

                <RepeatButton
                  onClick={onChangeRepeat}
                  disabled={!isOn}
                  title={`Repeat: ${repeat}`}
                  active={repeat !== "off"}
                >
                  <RepeatIconComponent />
                </RepeatButton>

                <ControlButton
                  onClick={toggleVolumeSlider}
                  disabled={!isOn}
                  title="Volume"
                  style={{ marginLeft: "auto" }}
                >
                  <VolumeIcon />
                </ControlButton>
              </>
            )}

            <InfoButton onClick={onMoreInfo} title="More Information">
              <DotsVerticalIcon size={18} />
            </InfoButton>
          </Controls>
        </ContentContainer>
      </CardContent>
      {/* @ts-ignore - ha-card is a custom element from Home Assistant */}
    </ha-card>
  )
}

