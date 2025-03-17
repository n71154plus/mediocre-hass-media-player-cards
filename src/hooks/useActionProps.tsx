import { handleAction, HomeAssistant } from "custom-card-helpers";
import { InteractionConfig } from "../types/actionTypes";
import { useMemo } from "preact/hooks";
import { useButtonCallbacks } from ".";

export function useActionProps({
  actionConfig,
  rootElement,
  hass,
}: {
  actionConfig: InteractionConfig;
  rootElement: HTMLElement;
  hass: HomeAssistant;
}) {
  const buttonProps = useButtonCallbacks({
    onTap: () => {
      handleAction(rootElement, hass, actionConfig, "tap");
    },
    onLongPress: () => {
      handleAction(rootElement, hass, actionConfig, "hold");
    },
    onDoubleTap: () => {
      handleAction(rootElement, hass, actionConfig, "double_tap");
    },
  });

  return useMemo(() => buttonProps, [buttonProps]);
}
