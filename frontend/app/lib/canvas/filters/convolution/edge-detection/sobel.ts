import { FilterImageProps } from '../../filter';
import { ConvolutionMatrix, convolve2d } from '../convolve';

const SOBEL_X: ConvolutionMatrix = Object.freeze([
  Object.freeze([1, 0, -1] as const),
  Object.freeze([2, 0, -2] as const),
  Object.freeze([1, 0, -1] as const),
] as const);

const SOBEL_Y: ConvolutionMatrix = Object.freeze([
  Object.freeze([1, 2, 1] as const),
  Object.freeze([0, 0, 0] as const),
  Object.freeze([-1, -2, -1] as const),
] as const);

const sobelEdgeDetection = (props: FilterImageProps) =>
  convolve2d({
    ...props,
    convolutionMatrixX: SOBEL_X,
    convolutionMatrixY: SOBEL_Y,
    ifUsingMaxGradient: true,
  });

export default sobelEdgeDetection;
