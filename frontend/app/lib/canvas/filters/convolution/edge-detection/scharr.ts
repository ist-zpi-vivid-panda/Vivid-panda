import { FilterImageProps } from '../../filter';
import { ConvolutionMatrix, convolve2d } from '../convolve';

export const SCHARR_X: ConvolutionMatrix = Object.freeze([
  Object.freeze([-3, 0, 3] as const),
  Object.freeze([-10, 0, 10] as const),
  Object.freeze([-3, 0, 3] as const),
] as const);

export const SCHARR_Y: ConvolutionMatrix = Object.freeze([
  Object.freeze([3, 10, 3] as const),
  Object.freeze([0, 0, 0] as const),
  Object.freeze([-3, -10, -3] as const),
] as const);

const scharrEdgeDetection = (props: FilterImageProps) =>
  convolve2d({
    ...props,
    convolutionMatrixX: SCHARR_X,
    convolutionMatrixY: SCHARR_Y,
    ifUsingMaxGradient: true,
  });

export default scharrEdgeDetection;
