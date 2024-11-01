import laplacianEdgeDetection from './convolution/edge-detection/laplacian';
import robertsCrossEdgeDetection from './convolution/edge-detection/robertsCross';
import scharrEdgeDetection from './convolution/edge-detection/scharr';
import sobelEdgeDetection from './convolution/edge-detection/sobel';
import boxblur from './other/boxblur';
import greyscale from './other/greyscale';
import inversion from './other/inversion';
import sepia from './other/sepia';

export type FilterImageProps = {
  imageData: ImageData;
  startPointX: number;
  startPointY: number;
  endPointX: number;
  endPointY: number;
};

export enum FilterType {
  LaplacianEdgeDetection = 'LAPLACIAN_EDGE_DETECTION',
  RobertsCrossEdgeDetection = 'ROBERTS_CROSS_EDGE_DETECTION',
  ScharrEdgeDetection = 'SCHARR_EDGE_DETECTION',
  SobelEdgeDetection = 'SOBEL_EDGE_DETECTION',
  Sepia = 'SEPIA',
  Greyscale = 'GREYSCALE',
  Inversion = 'INVERSION',
  BoxBlur = 'BOX_BLUR',
}

export const filterTypeToFilterFn: Record<FilterType, (_: FilterImageProps) => ImageData> = Object.freeze({
  [FilterType.LaplacianEdgeDetection]: laplacianEdgeDetection,
  [FilterType.RobertsCrossEdgeDetection]: robertsCrossEdgeDetection,
  [FilterType.ScharrEdgeDetection]: scharrEdgeDetection,
  [FilterType.SobelEdgeDetection]: sobelEdgeDetection,
  [FilterType.Sepia]: sepia,
  [FilterType.Greyscale]: greyscale,
  [FilterType.Inversion]: inversion,
  [FilterType.BoxBlur]: boxblur,
} as const);

export const getGrayScaleLuminance = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
