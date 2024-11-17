import { applyToEachPixel, FilterImageProps, RGBData } from '../filter';

const pixelTransformFn = ({ b }: RGBData): RGBData => ({
  r: 0,
  g: 0,
  b,
});

const onlyBlue = (props: FilterImageProps) => applyToEachPixel({ ...props, pixelTransformFn });

export default onlyBlue;
