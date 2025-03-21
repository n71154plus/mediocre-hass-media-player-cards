# Mediocre Media Player Cards

A collection of custom media player cards for Home Assistant that support speaker grouping and custom actions.

> **Note:** These cards were created primarily for personal use and are shared as-is. While they may be useful for others, they are not actively maintained as a public project, and support may be limited.

## Installation

1. Download the latest release from the [releases page](https://github.com/antontanderup/mediocre-hass-media-player-cards/releases)
2. Copy the JavaScript file to your `www/` directory in your Home Assistant configuration
3. Add the resource to your Lovelace configuration:

```yaml
resources:
  - url: /local/mediocre-media-player-card.js
    type: module
```

4. Refresh your browser

## Available Cards

### Mediocre Media Player Card

A standard-sized media player card with speaker grouping support that fits well in dashboards.

![Mediocre Media Player Card Screenshot](screenshots/mediocre-card.png)

#### Configuration

```yaml
type: "custom:mediocre-media-player-card"
entity_id: media_player.living_room_speaker
speaker_group:
  entities:
    - media_player.kitchen_speaker
    - media_player.bedroom_speaker
```

### Mediocre Massive Media Player Card

A full-sized media player card designed specifically for panel view. This card provides an immersive media control experience with all features available at a glance.

**Note: This card is intended for panel view only and is not suitable for dashboard use.**

![Mediocre Massive Media Player Card Screenshot](screenshots/massive-card.png)

#### Configuration

```yaml
type: "custom:mediocre-massive-media-player-card"
entity_id: media_player.living_room_speaker
speaker_group:
  entities:
    - media_player.kitchen_speaker
    - media_player.bedroom_speaker
```

## Configuration Options

Both cards support the following configuration options:

| Option                    | Type   | Default  | Description                                                      |
| ------------------------- | ------ | -------- | ---------------------------------------------------------------- |
| `entity_id`               | string | Required | The entity ID of the media player                                |
| `action`                  | object | -        | Configuration for tap actions                                    |
| `speaker_group`           | object | -        | Configuration for speaker grouping                               |
| `speaker_group.entity_id` | string | -        | Entity ID of the main speaker if different from the media player |
| `speaker_group.entities`  | array  | -        | List of entity IDs that can be grouped with the main speaker     |
| `custom_buttons`          | array  | -        | List of custom buttons to display                                |

### Action Configuration

```yaml
action:
  tap_action:
    action: navigate
    navigation_path: /media-player/living-room
```

### Custom Buttons

You can add custom buttons with specific actions:

```yaml
custom_buttons:
  - icon: mdi:playlist-music
    name: Playlists
    tap_action:
      action: navigate
      navigation_path: /media-player/playlists
  - icon: mdi:equalizer
    name: Equalizer
    tap_action:
      action: call-service
      service: media_player.open_equalizer
      service_data:
        entity_id: media_player.living_room_speaker
```

## Troubleshooting

If you encounter issues:

1. Check that your entity supports the media player features required
2. Verify your configuration syntax
3. Look for errors in your browser's developer console

## Development

These cards are built with Preact wrapped in web components. For local development:

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build
```
