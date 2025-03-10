import styled from "styled-components";
import { MdiReactIconComponentType } from "mdi-preact";
import { Fragment } from "preact/jsx-runtime";

export type IconButtonProps = {
  Icon: MdiReactIconComponentType | string;
  onClick: () => void;
  size?: "xx-small" | "x-small" | "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
};

const Button = styled.button<{
  $disabled: boolean;
  $size: "xx-small" | "x-small" | "small" | "medium" | "large";
}>`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  padding: ${(props) => (props.$size === "xx-small" ? 0 : 4)}px;
  min-width: ${(props) => getSize(props.$size)}px;
  aspect-ratio: 1;
  color: ${(props) =>
    props.disabled
      ? "var(--disabled-text-color, #999)"
      : "var(--primary-text-color, #333)"};

  &:hover {
    background-color: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
  }

  &:active {
    background-color: var(--divider-color, rgba(0, 0, 0, 0.1));
  }
  > ha-icon {
    --mdc-icon-size: ${(props) => getSize(props.$size)}px;
    display: flex;
  }
`;

export const IconButton = ({
  Icon,
  onClick,
  size = "medium",
  disabled = false,
  className,
}: IconButtonProps) => {
  const width = getSize(size);
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      $disabled={disabled}
      $size={size}
      className={className}
    >
      {typeof Icon === "string" ? (
        <Fragment>
          {/* @ts-ignore - ha-icon is a custom element from Home Assistant */}
          <ha-icon icon={Icon} />
        </Fragment>
      ) : (
        <Icon size={width} />
      )}
    </Button>
  );
};

const getSize = (
  size: "xx-small" | "x-small" | "small" | "medium" | "large"
) => {
  switch (size) {
    case "xx-small":
      return 12;
    case "x-small":
      return 18;
    case "small":
      return 24;
    case "medium":
      return 48;
    case "large":
      return 80;
  }
};
