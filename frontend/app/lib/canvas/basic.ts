import { MouseInfo } from './definitions';

type MouseInfoSetterProps = {
  event: React.MouseEvent<HTMLDivElement, MouseEvent>;
  parent: HTMLDivElement | null;
  setMouseInfo: (_: MouseInfo) => void;
};

type ResizeCanvasToParentProps = {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  image: HTMLImageElement | null;
};

export const mouseInfoCalc = ({ event, parent, setMouseInfo }: MouseInfoSetterProps) => {
  if (!parent) {
    return;
  }

  const bounds = parent.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;

  const deltaX = x - parent.clientWidth / 2;
  const deltaY = y - parent.clientHeight / 2;
  const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

  setMouseInfo({ x, y, angle });
};

export const getImageSizes = (imageWidth: number, imageHeight: number, parentWidth: number, parentHeight: number) => {
  const aspectRatio = imageWidth / imageHeight;

  let newWidth = parentWidth;
  let newHeight = parentHeight;

  if (newWidth / newHeight > aspectRatio) {
    newWidth = newHeight * aspectRatio;
  } else {
    newHeight = newWidth / aspectRatio;
  }

  return { width: newWidth, height: newHeight };
};

export const resizeCanvasToParent = ({ canvas, ctx, image }: ResizeCanvasToParentProps) => {
  const parent = canvas?.parentElement;

  if (!ctx || !canvas || !parent || !image) {
    return;
  }

  const { clientWidth, clientHeight } = parent;

  const res = getImageSizes(image.width, image.height, clientWidth, clientHeight);

  canvas.width = res.width;
  canvas.height = res.height;

  return res;
};
