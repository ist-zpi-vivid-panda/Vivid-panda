import { CanvasAction, EditingTool, MouseInfo, RepeatableCanvasAction } from './types';

type ResizeCanvasToParentProps = {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  image: HTMLImageElement | null;
  canvasOperations: Record<EditingTool, (_: RepeatableCanvasAction) => void>;
};

type RunCanvasActionProps = {
  mouseInfo: MouseInfo;
  canvasAction: (_: CanvasAction) => void;
};

type MouseInfoSetterProps = {
  event: React.MouseEvent<HTMLDivElement, MouseEvent>;
  canvas: HTMLCanvasElement | null;
  setMouseInfo: (_: MouseInfo) => void;
};

export const resizeCanvasToParent = ({ canvas, ctx, image, canvasOperations }: ResizeCanvasToParentProps) => {
  const parent = canvas?.parentElement;
  if (!ctx || !canvas || !parent || !image) {
    return;
  }

  const { clientWidth, clientHeight } = parent;

  canvas.width = clientWidth;
  canvas.height = clientHeight;

  const { width, height } = getImageSizes(image.width, image.height, clientWidth, canvas.height);

  ctx.drawImage(image, 0, clientHeight / 2 - height / 2, width, height);

  Object.values(canvasOperations).forEach((operation) => operation({ canvas, ctx, image }));
};

export const mouseInfoSetter = ({ event, canvas, setMouseInfo }: MouseInfoSetterProps) => {
  if (!canvas) {
    return;
  }

  const bounds = canvas.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;

  const deltaX = x - canvas.width / 2;
  const deltaY = y - canvas.height / 2;
  const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

  setMouseInfo({ x, y, angle });
};

export const createCanvasAction = ({ mouseInfo: mouse, canvasAction }: RunCanvasActionProps) => {
  const res = ({ image, canvas: cnv, ctx: context }: RepeatableCanvasAction) =>
    canvasAction({
      canvas: cnv,
      ctx: context,
      angle: mouse.angle,
      x: mouse.x,
      y: mouse.y,
      image,
    });

  return res;
};

export const getImageSizes = (imageWidth: number, imageHeight: number, canvasWidth: number, canvasHeight: number) => {
  const aspectRatio = imageWidth / imageHeight;

  let newWidth = Math.min(canvasWidth, imageWidth);
  let newHeight = Math.min(canvasHeight, imageHeight);

  if (newWidth / newHeight > aspectRatio) {
    newWidth = newHeight * aspectRatio;
  } else {
    newHeight = newWidth / aspectRatio;
  }

  return { width: newWidth, height: newHeight };
};
