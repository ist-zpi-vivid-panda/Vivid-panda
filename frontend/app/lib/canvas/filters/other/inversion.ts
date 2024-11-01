import { FilterImageProps } from '../filter';

const inversion = ({ imageData, startPointX, startPointY, endPointX, endPointY }: FilterImageProps) => {
  const { data, width } = imageData;

  for (let y = startPointY; y < endPointY; ++y) {
    for (let x = startPointX; x < endPointX; ++x) {
      const index = (y * width + x) * 4;

      data[index] = 255 - data[index];
      data[index + 1] = 255 - data[index + 1];
      data[index + 2] = 255 - data[index + 2];
      // Alpha remains the same
    }
  }

  return imageData;
};

export default inversion;
