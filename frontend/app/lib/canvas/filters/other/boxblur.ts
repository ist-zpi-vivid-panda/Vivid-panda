import { FilterImageProps } from '../filter';

const boxblur = ({ imageData, startPointX, startPointY, endPointX, endPointY }: FilterImageProps) => {
  const { data, width } = imageData;

  const newImageData = new Uint8ClampedArray(data.length);

  for (let y = startPointY + 1; y < endPointY - 1; ++y) {
    for (let x = startPointX + 1; x < endPointX - 1; ++x) {
      const index = (y * width + x) * 4;

      let rSum = 0,
        gSum = 0,
        bSum = 0;

      // Loop through the 3x3 grid around the pixel
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const neighborIndex = ((y + dy) * width + (x + dx)) * 4;
          rSum += data[neighborIndex];
          gSum += data[neighborIndex + 1];
          bSum += data[neighborIndex + 2];
        }
      }

      // average
      const rValue = rSum / 9;
      const gValue = gSum / 9;
      const bValue = bSum / 9;

      newImageData[index] = rValue;
      newImageData[index + 1] = gValue;
      newImageData[index + 2] = bValue;
      newImageData[index + 3] = data[index + 3];
    }
  }

  imageData.data.set(newImageData);

  return imageData;
};

export default boxblur;
