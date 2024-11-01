import { FilterImageProps } from '../../filter';
import { ConvolutionMatrix, convolve1d } from '../convolve';

const LAPLACIAN: ConvolutionMatrix = Object.freeze([
  Object.freeze([-1, -1, -1, -1, -1] as const),
  Object.freeze([-1, -1, -1, -1, -1] as const),
  Object.freeze([-1, -1, 24, -1, -1] as const),
  Object.freeze([-1, -1, -1, -1, -1] as const),
  Object.freeze([-1, -1, -1, -1, -1] as const),
] as const);

const laplacianEdgeDetection = (props: FilterImageProps) =>
  convolve1d({ ...props, convolutionMatrix: LAPLACIAN, ifUsingMaxGradient: true });

export default laplacianEdgeDetection;
