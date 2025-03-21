# Mediocre Media Player Cards

A bunch of custom media player cards for Home Assistant that let you group speakers and do some custom actions.

> **Note:** These cards were made mainly for my own use and are shared as-is. They might be useful for you, but don't expect regular updates or support.

## Installation

1. Grab the latest release from the [releases page](https://github.com/antontanderup/mediocre-hass-media-player-cards/releases)
2. Copy the JavaScript file to your `www/` directory in your Home Assistant setup
3. Add the resource to your Lovelace config:

```yaml
resources:
  - url: /local/mediocre-media-player-card.js
    type: module
```

4. Refresh your browser

## Available Cards

### Mediocre Media Player Card

A standard-sized media player card with speaker grouping support that fits nicely in dashboards.

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

A full-sized media player card made for panel view. This card gives you an immersive media control experience with all features at a glance.

**Note: This card is meant for panel view only and doesn't work well in dashboards.**

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

Both cards support these options:

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

If you run into issues:

1. Check that your entity supports the media player features needed
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
