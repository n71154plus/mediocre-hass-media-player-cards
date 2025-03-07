import styled from "styled-components";
import { MdiReactIconComponentType } from "mdi-preact";

export type IconButtonProps = {
  Icon: MdiReactIconComponentType;
  onClick: () => void;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
};

const Button = styled.button<{ $disabled: boolean }>`
  all: unset;
  padding: 15px; // Hitslop
  margin: -15px; // Hitspop
  border-radius: 50%;
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
`;

export const IconButton = ({
  Icon,
  onClick,
  size = "medium",
  disabled = false,
}: IconButtonProps) => {
  const width = size === "small" ? 18 : size === "medium" ? 48 : 80;
  return (
    <Button onClick={onClick} disabled={disabled} $disabled={disabled}>
      <Icon
        className={`icon icon-${size ?? "medium"}${
          disabled ? " icon-disabled" : ""
        }"`}
        size={width}
      />
    </Button>
  );
};
