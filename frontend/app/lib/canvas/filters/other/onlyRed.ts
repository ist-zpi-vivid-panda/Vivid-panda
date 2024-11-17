import { applyToEachPixel, FilterImageProps, RGBData } from '../filter';

const pixelTransformFn = ({ r }: RGBData): RGBData => ({
  r,
  g: 0,
  b: 0,
});

const onlyRed = (props: FilterImageProps) => applyToEachPixel({ ...props, pixelTransformFn });

export default onlyRed;
