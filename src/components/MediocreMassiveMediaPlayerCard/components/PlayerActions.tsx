import { useCallback, useContext, useState } from "preact/hooks";
import { MediocreMassiveMediaPlayerCardConfig } from "../";
import styled, { keyframes } from "styled-components";
import { IconButton } from "../../IconButton";
import { CardContext, CardContextType, useActionProps } from "../../../utils";
import { ReactNode } from "preact/compat";
import { VolumeController, VolumeTrigger } from "./VolumeController";
import { SpeakerGrouping } from "./SpeakerGrouping";
import { InteractionConfig } from "../../../types";
import { Chip } from "../../Chip";
import { Icon } from "../../Icon";

const PlaybackControlsWrap = styled.div`
  background-color: var(--card-background-color);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  padding: 12px;
  width: 100%;
  position: relative;
  box-sizing: border-box;
`;

const slideUpFadeIn = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ModalRoot = styled.div`
  position: absolute;
  bottom: calc(100% + 12px);
  left: 0;
  width: 100%;
  background-color: var(--card-background-color);
  border-radius: 12px;
  box-sizing: border-box;
  animation: ${slideUpFadeIn} 0.3s ease forwards;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  > h4 {
    margin: 0;
  }
  padding: 8px 16px;
  border-bottom: 0.5px solid var(--divider-color, rgba(0, 0, 0, 0.12));
`;

const ModalContent = styled.div<{ padding?: string }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: ${(props) => props.padding ?? "16px"};
`;

export const PlayerActions = () => {
  const { hass, config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );

  const { custom_buttons } = config;

  if (!custom_buttons || custom_buttons.length === 0) {
    return null;
  }

  const [selected, setSelected] = useState<"volume" | "speaker-grouping">();

  const toggleSelected = useCallback(
    (key: "volume" | "speaker-grouping") => {
      setSelected(selected === key ? undefined : key);
    },
    [selected]
  );

  return (
    <PlaybackControlsWrap>
      <Modal
        title="Volume"
        isOpen={selected === "volume"}
        onClose={() => setSelected(undefined)}
      >
        <VolumeController />
      </Modal>
      <Modal
        title="Speaker Grouping"
        isOpen={selected === "speaker-grouping"}
        onClose={() => setSelected(undefined)}
        padding="16px 0px 16px 0px"
      >
        <SpeakerGrouping />
      </Modal>
      <IconButton
        size="small"
        Icon={"mdi:speaker-multiple"}
        onClick={() => toggleSelected("speaker-grouping")}
      />
      {custom_buttons.map((button, index) => (
        <CustomButton key={index} button={button} type={"icon-button"} />
      ))}
      <VolumeTrigger onClick={() => toggleSelected("volume")} />
    </PlaybackControlsWrap>
  );
};

const Modal = ({
  children,
  title,
  isOpen,
  padding,
  onClose,
}: {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  padding?: string;
  onClose: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <ModalRoot>
      <ModalHeader>
        <h4>{title}</h4>
        <IconButton size="small" Icon={"mdi:close"} onClick={onClose} />
      </ModalHeader>
      <ModalContent padding={padding}>{children}</ModalContent>
    </ModalRoot>
  );
};

export const CustomButton = ({
  button,
  type = "chip",
}: {
  type?: "chip" | "icon-button";
  button: InteractionConfig & {
    icon?: string;
    name?: string;
  };
}) => {
  const { hass, rootElement, config } =
    useContext<CardContextType<MediocreMassiveMediaPlayerCardConfig>>(
      CardContext
    );
  const { icon, name, ...actionConfig } = button;
  const actionProps = useActionProps({
    hass,
    rootElement,
    actionConfig: {
      ...actionConfig,
      entity: config.entity_id,
    },
  });
  if (type === "icon-button") {
    return (
      <IconButton
        Icon={button.icon ?? "mdi:dots-vertical"}
        size={"small"}
        {...actionProps}
      />
    );
  }

  return (
    <Chip {...actionProps}>
      {!!icon && <Icon Icon={icon} size={"x-small"} />}
      {!!name && <span>{name}</span>}
    </Chip>
  );
};
