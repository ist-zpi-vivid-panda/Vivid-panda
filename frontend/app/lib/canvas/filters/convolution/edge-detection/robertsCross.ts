import { FilterImageProps } from '../../filter';
import { ConvolutionMatrix, convolve2d } from '../convolve';

export const ROBERTS_CROSS_X: ConvolutionMatrix = Object.freeze([
  Object.freeze([1, 0] as const),
  Object.freeze([0, -1] as const),
] as const);

export const ROBERTS_CROSS_Y: ConvolutionMatrix = Object.freeze([
  Object.freeze([0, 1] as const),
  Object.freeze([-1, 0] as const),
] as const);

const robertsCrossEdgeDetection = (props: FilterImageProps) =>
  convolve2d({
    ...props,
    convolutionMatrixX: ROBERTS_CROSS_X,
    convolutionMatrixY: ROBERTS_CROSS_Y,
    ifUsingMaxGradient: true,
  });

export default robertsCrossEdgeDetection;
