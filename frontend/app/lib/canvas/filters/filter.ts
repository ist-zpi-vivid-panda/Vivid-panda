import laplacianEdgeDetection from './convolution/edge-detection/laplacian';
import robertsCrossEdgeDetection from './convolution/edge-detection/robertsCross';
import scharrEdgeDetection from './convolution/edge-detection/scharr';
import sobelEdgeDetection from './convolution/edge-detection/sobel';
import boxblur from './other/boxblur';
import greyscale from './other/greyscale';
import inversion from './other/inversion';
import onlyBlue from './other/onlyBlue';
import onlyGreen from './other/onlyGrees';
import onlyRed from './other/onlyRed';
import sepia from './other/sepia';

export type FilterImageProps = {
  imageData: ImageData;
  startPointX: number;
  startPointY: number;
  endPointX: number;
  endPointY: number;
};

export type RGBData = { r: number; g: number; b: number };

type PixelTransformer = {
  pixelTransformFn: (_: RGBData) => RGBData;
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
  OnlyRed = 'ONLY_RED',
  OnlyGreen = 'ONLY_GREEN',
  OnlyBlue = 'ONLY_BLUE',
}

export const FILTER_TYPE_TO_FILTER_FN: Record<FilterType, (_: FilterImageProps) => ImageData> = Object.freeze({
  [FilterType.LaplacianEdgeDetection]: laplacianEdgeDetection,
  [FilterType.RobertsCrossEdgeDetection]: robertsCrossEdgeDetection,
  [FilterType.ScharrEdgeDetection]: scharrEdgeDetection,
  [FilterType.SobelEdgeDetection]: sobelEdgeDetection,
  [FilterType.Sepia]: sepia,
  [FilterType.Greyscale]: greyscale,
  [FilterType.Inversion]: inversion,
  [FilterType.BoxBlur]: boxblur,
  [FilterType.OnlyRed]: onlyRed,
  [FilterType.OnlyGreen]: onlyGreen,
  [FilterType.OnlyBlue]: onlyBlue,
} as const);

export const getGrayScaleLuminance = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

export const applyToEachPixel = ({
  imageData,
  startPointX,
  startPointY,
  endPointX,
  endPointY,
  pixelTransformFn,
}: FilterImageProps & PixelTransformer) => {
  const { data, width } = imageData;

  for (let y = startPointY; y < endPointY; ++y) {
    for (let x = startPointX; x < endPointX; ++x) {
      const index = (y * width + x) * 4;

      const { r, g, b } = pixelTransformFn({ r: data[index], g: data[index + 1], b: data[index + 2] });

      data[index] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      // Alpha remains the same
    }
  }

  return imageData;
};
