import { applyToEachPixel, FilterImageProps, getGrayScaleLuminance, RGBData } from '../filter';

const pixelTransformFn = ({ r, g, b }: RGBData): RGBData => {
  const rValue = getGrayScaleLuminance(r, g, b);

  return {
    r: rValue,
    g: rValue,
    b: rValue,
  };
};

const greyscale = (props: FilterImageProps) => applyToEachPixel({ ...props, pixelTransformFn });

export default greyscale;
