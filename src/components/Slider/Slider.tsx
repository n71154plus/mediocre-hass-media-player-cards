import styled from "styled-components";

export type SliderProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  thumbSize?: "xsmall" | "small" | "medium";
  onChange: (value: number) => void;
};

const SliderWrap = styled.div`
  display: contents;
  > ha-slider {
    width: 100%;
  }
`;

export const Slider = ({
  min,
  max,
  step,
  value,
  thumbSize,
  onChange,
}: SliderProps) => {
  return (
    <SliderWrap>
      <ha-slider
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={(e) =>
          onChange(parseFloat((e.target as HTMLInputElement).value))
        }
      />
    </SliderWrap>
  );
};
