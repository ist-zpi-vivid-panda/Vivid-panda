import { FilterImageProps } from '../filter';

const sepia = ({ imageData, startPointX, startPointY, endPointX, endPointY }: FilterImageProps) => {
  const { data, width } = imageData;

  for (let y = startPointY; y < endPointY; ++y) {
    for (let x = startPointX; x < endPointX; ++x) {
      const index = (y * width + x) * 4;

      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];

      const newR = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
      const newG = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
      const newB = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);

      data[index] = newR;
      data[index + 1] = newG;
      data[index + 2] = newB;
      // Alpha remains the same
    }
  }

  return imageData;
};

export default sepia;
