import { applyToEachPixel, FilterImageProps, RGBData } from '../filter';

const pixelTransformFn = ({ g }: RGBData): RGBData => ({
  r: 0,
  g,
  b: 0,
});

const onlyGreen = (props: FilterImageProps) => applyToEachPixel({ ...props, pixelTransformFn });

export default onlyGreen;
