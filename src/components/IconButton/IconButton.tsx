import styled from "styled-components";
import { MdiReactIconComponentType } from "mdi-preact";
import { Fragment } from "preact/jsx-runtime";
import { ButtonHTMLAttributes } from "preact/compat";

export type ButtonSize =
  | "xx-small"
  | "x-small"
  | "small"
  | "medium"
  | "large"
  | "x-large";

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  Icon: MdiReactIconComponentType | string;
  size?: ButtonSize;
  disabled?: boolean;
};

const Button = styled.button<{
  $disabled: boolean;
  $size: ButtonSize;
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
  min-width: ${(props) => getButtonSize(props.$size)}px;
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
    --mdc-icon-size: ${(props) => getButtonSize(props.$size)}px;
    width: ${(props) => getButtonSize(props.$size)}px;
    display: flex;
  }
`;

export const IconButton = ({
  Icon,
  size = "medium",
  disabled = false,
  className,
  ...buttonProps
}: IconButtonProps) => {
  const width = getButtonSize(size);
  return (
    <Button
      disabled={disabled}
      $disabled={disabled}
      $size={size}
      className={className}
      {...buttonProps}
    >
      {typeof Icon === "string" ? (
        <Fragment>
          <ha-icon icon={Icon} />
        </Fragment>
      ) : (
        <Icon size={width} />
      )}
    </Button>
  );
};

const getButtonSize = (size: ButtonSize) => {
  switch (size) {
    case "xx-small":
      return 12;
    case "x-small":
      return 18;
    case "small":
      return 24;
    case "medium":
      return 32;
    case "large":
      return 48;
    case "x-large":
      return 80;
  }
};
