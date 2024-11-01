import { FilterImageProps, getGrayScaleLuminance } from '../filter';

export type ConvolutionMatrix = Readonly<Readonly<number[]>[]>;

type ConvolveProps = FilterImageProps & {
  ifUsingMaxGradient: boolean;
};

type Convolve1DProps = ConvolveProps & {
  convolutionMatrix: ConvolutionMatrix;
};

type Convolve2DProps = ConvolveProps & {
  convolutionMatrixX: ConvolutionMatrix;
  convolutionMatrixY: ConvolutionMatrix;
};

const EMPTY_CELL_VALUE = 0 as const;

export const convolve2d = ({
  imageData,
  ifUsingMaxGradient,
  startPointX,
  startPointY,
  endPointX,
  endPointY,
  convolutionMatrixX,
  convolutionMatrixY,
}: Convolve2DProps) => {
  let maxGradient = -1;

  // Validate convolution matrices
  if (
    convolutionMatrixX.length <= 0 ||
    convolutionMatrixY.length <= 0 ||
    convolutionMatrixX.length !== convolutionMatrixY.length ||
    convolutionMatrixX[0].length !== convolutionMatrixY[0].length
  ) {
    return imageData; // Exit if matrices are invalid
  }

  const kernelSizeX = convolutionMatrixX.length;
  const kernelSizeY = convolutionMatrixX[0].length;
  const bx = Math.floor(kernelSizeX / 2);
  const by = Math.floor(kernelSizeY / 2);

  // Prepare a 2D array for storing gradient values
  const edgeColors = Array.from({ length: endPointX - startPointX }, () => Array(endPointY - startPointY).fill(0));

  // Perform convolution with matrices X and Y
  for (let x = startPointX; x < endPointX; ++x) {
    for (let y = startPointY; y < endPointY; ++y) {
      let gx = 0;
      let gy = 0;

      // Check if the entire kernel is within bounds
      if (x - bx >= startPointX && x + bx < endPointX && y - by >= startPointY && y + by < endPointY) {
        for (let cX = 0; cX < kernelSizeX; ++cX) {
          for (let cY = 0; cY < kernelSizeY; ++cY) {
            const pixelIndex = (x - bx + cX + (y - by + cY) * imageData.width) * 4;
            const grayScaleValue = getGrayScaleLuminance(
              imageData.data[pixelIndex],
              imageData.data[pixelIndex + 1],
              imageData.data[pixelIndex + 2]
            );

            gx += convolutionMatrixX[cX][cY] * grayScaleValue;
            gy += convolutionMatrixY[cX][cY] * grayScaleValue;
          }
        }

        const g = Math.sqrt(gx * gx + gy * gy);

        if (maxGradient < g) {
          maxGradient = g;
        }

        edgeColors[x - startPointX][y - startPointY] = g;
      }
    }
  }

  // Normalize and update imageData with edge colors
  for (let x = startPointX; x < endPointX; ++x) {
    for (let y = startPointY; y < endPointY; ++y) {
      let edgeColor = edgeColors[x - startPointX][y - startPointY];

      if (ifUsingMaxGradient && maxGradient > 0) {
        edgeColor = Math.round(edgeColor * (255.0 / maxGradient));
      } else {
        edgeColor = Math.floor((edgeColor / (kernelSizeX * kernelSizeY)) * 255);
      }

      // Set the pixel color in the image data (apply grayscale color)
      const pixelIndex = (x + y * imageData.width) * 4;
      imageData.data[pixelIndex] = edgeColor; // Red
      imageData.data[pixelIndex + 1] = edgeColor; // Green
      imageData.data[pixelIndex + 2] = edgeColor; // Blue
      imageData.data[pixelIndex + 3] = 255; // Alpha (fully opaque)
    }
  }

  return imageData;
};

export const convolve1d = ({ convolutionMatrix, ...restOfProps }: Convolve1DProps) => {
  const zeroedConvolutionMatrix: ConvolutionMatrix = convolutionMatrix.map((row) =>
    Array(row.length).fill(EMPTY_CELL_VALUE)
  );

  return convolve2d({
    ...restOfProps,
    convolutionMatrixX: convolutionMatrix,
    convolutionMatrixY: zeroedConvolutionMatrix,
  });
};
