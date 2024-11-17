import { CanvasAction } from './definitions';

export const drawRotated = ({ canvas, ctx, image, angle }: CanvasAction) => {
  const { width: imgWidth, height: imgHeight } = image;

  const { width: canvasWidth, height: canvasHeight } = canvas;

  const { width: scaledWidth, height: scaledHeight } = getScaledImageDimensions(
    imgWidth,
    imgHeight,
    angle,
    canvasWidth,
    canvasHeight
  );

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  ctx.rotate((Math.PI / 180) * angle);

  ctx.drawImage(image, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);

  ctx.resetTransform();
};

const getScaledImageDimensions = (
  width: number,
  height: number,
  angle: number,
  canvasWidth: number,
  canvasHeight: number
) => {
  const radians = (Math.PI / 180) * angle;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));

  const rotatedWidth = height * sin + width * cos;
  const rotatedHeight = height * cos + width * sin;

  const widthScale = canvasWidth / rotatedWidth;
  const heightScale = canvasHeight / rotatedHeight;
  const scale = Math.min(widthScale, heightScale);

  return { width: width * scale, height: height * scale };
};

// const getBoundingBoxDimensions = (width: number, height: number, angle: number) => {
//   const radians = (Math.PI / 180) * angle;
//   const sin = Math.abs(Math.sin(radians));
//   const cos = Math.abs(Math.cos(radians));

//   const newWidth = height * sin + width * cos;
//   const newHeight = height * cos + width * sin;

//   return { width: newWidth, height: newHeight };
// };
