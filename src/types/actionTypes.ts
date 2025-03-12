import { ActionConfig } from "custom-card-helpers";

export type ActionType =
  | "more-info"
  | "toggle"
  | "navigate"
  | "url"
  | "call-service"
  | "assist";

export type InteractionType = "tap" | "hold" | "double_tap";

export type InteractionConfig = {
  entity?: string;
  camera_image?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
};
