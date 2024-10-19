import { CanvasAction, MouseInfo } from './types';

type ResizeCanvasToParentProps = {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  imageWidth: number;
  imageHeight: number;
  imageStr: string;
};

type RunCanvasActionProps = {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  image: HTMLImageElement | null;
  mouse: MouseInfo;
  canvasAction: (_: CanvasAction) => void;
};

export const resizeCanvasToParent = ({ canvas, ctx, imageWidth, imageHeight, imageStr }: ResizeCanvasToParentProps) => {
  const parent = canvas?.parentElement;

  if (!ctx || !canvas || !parent) {
    return;
  }

  const { clientWidth, clientHeight } = parent;

  const aspectRatio = imageWidth / imageHeight;

  let newWidth = Math.min(clientWidth, imageWidth);
  let newHeight = Math.min(clientHeight, imageHeight);

  if (newWidth / newHeight > aspectRatio) {
    newWidth = newHeight * aspectRatio;
  } else {
    newHeight = newWidth / aspectRatio;
  }

  canvas.width = clientWidth;
  canvas.height = clientHeight;

  const image = new Image();
  image.src = imageStr;
  image.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, canvas.height / 2, newWidth, newHeight);
  };
};

export const runCanvasAction = ({ ctx, canvas, image, mouse, canvasAction }: RunCanvasActionProps) => {
  const parent = canvas?.parentElement;
  if (!ctx || !canvas || !image || !parent) {
    return;
  }

  canvasAction({
    canvas,
    ctx,
    image,
    angle: mouse.angle,
    x: mouse.x,
    y: mouse.y,
  });
};
