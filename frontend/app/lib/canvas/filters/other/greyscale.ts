import { FilterImageProps, getGrayScaleLuminance } from '../filter';

const greyscale = ({ imageData, startPointX, startPointY, endPointX, endPointY }: FilterImageProps) => {
  const { data, width } = imageData;

  for (let y = startPointY; y < endPointY; ++y) {
    for (let x = startPointX; x < endPointX; ++x) {
      const index = (y * width + x) * 4;

      const rValue = getGrayScaleLuminance(data[index], data[index + 1], data[index + 2]);

      data[index] = rValue;
      data[index + 1] = rValue;
      data[index + 2] = rValue;
      // Alpha remains the same
    }
  }

  return imageData;
};

export default greyscale;
