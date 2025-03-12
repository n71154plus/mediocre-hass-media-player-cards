// Ai generated crap below because i couldnt be bothered
import { handleAction, HomeAssistant } from "custom-card-helpers";
import { InteractionConfig, InteractionType } from "../types/actionTypes";
import { useCallback, useMemo, useRef } from "preact/hooks";

export function useActionProps({
  actionConfig,
  rootElement,
  hass,
}: {
  actionConfig: InteractionConfig;
  rootElement: HTMLElement;
  hass: HomeAssistant;
}) {
  const longPressTimeout = useRef<number | null>(null);
  const resetTimeout = useRef<number | null>(null);
  const actionType = useRef<InteractionType | null>(null);
  const isDoubleClick = useRef<boolean>(false);

  const resetAction = useCallback(() => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    actionType.current = null;
    isDoubleClick.current = false;
  }, []);

  const performAction = useCallback(() => {
    if (actionType.current === null) return;
    handleAction(rootElement, hass, actionConfig, actionType.current);
    // Cleanup after action
    resetAction();
  }, [actionConfig, rootElement, hass, resetAction]);

  const onMouseDown = useCallback(() => {
    actionType.current = "tap";
    longPressTimeout.current = window.setTimeout(() => {
      actionType.current = "hold";
    }, 500); // 500ms for long press

    resetTimeout.current = window.setTimeout(resetAction, 2000); // 2000ms for reset if onMouseUp is not triggered
  }, [resetAction]);

  const onMouseUp = useCallback(() => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    if (resetTimeout.current) {
      clearTimeout(resetTimeout.current);
      resetTimeout.current = null;
    }
    if (!isDoubleClick.current && actionType.current !== "double_tap") {
      setTimeout(() => {
        if (!isDoubleClick.current) {
          performAction();
        }
      }, 250); // Wait 250ms to check if double click occurred
    }
  }, [performAction]);

  const onDblClick = useCallback(
    (e) => {
      e.preventDefault();
      isDoubleClick.current = true;
      actionType.current = "double_tap";
      performAction();
    },
    [performAction]
  );

  return useMemo(
    () => ({
      onMouseDown,
      onMouseUp,
      onDblClick,
    }),
    [onMouseDown, onMouseUp, onDblClick]
  );
}
