import { applyToEachPixel, FilterImageProps, RGBData } from '../filter';

const pixelTransformFn = ({ r, g, b }: RGBData): RGBData => ({
  r: 255 - r,
  g: 255 - g,
  b: 255 - b,
});

const inversion = (props: FilterImageProps) => applyToEachPixel({ ...props, pixelTransformFn });

export default inversion;
