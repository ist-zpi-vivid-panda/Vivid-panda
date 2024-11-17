import { applyToEachPixel, FilterImageProps, RGBData } from '../filter';

const pixelTransformFn = ({ r, g, b }: RGBData): RGBData => ({
  r: Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b),
  g: Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b),
  b: Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b),
});

const sepia = (props: FilterImageProps) => applyToEachPixel({ ...props, pixelTransformFn });

export default sepia;
