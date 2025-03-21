import {
  MediocreMediaPlayerCardConfig,
  MediocreMediaPlayerCardEditor,
} from "../components/MediaPlayerCommon";
import { PreactEditorWrapper } from "../utils";

class MediocreMediaPlayerCardEditorWrapper extends PreactEditorWrapper<MediocreMediaPlayerCardConfig> {
  Card = MediocreMediaPlayerCardEditor;
}

customElements.define(
  "mediocre-media-player-card-editor",
  MediocreMediaPlayerCardEditorWrapper
);
