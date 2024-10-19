'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { resizeCanvasToParent, runCanvasAction } from '@/app/lib/canvas/basic';
import { drawRotated } from '@/app/lib/canvas/rotation';
import { CanvasAction, EditingTool, MouseInfo } from '@/app/lib/canvas/types';

type CanvasProps = {
  imageStr: string;
  editingTool: EditingTool | undefined;
};

type Size = {
  width: number;
  height: number;
};

const RESIZE_EVENT_NAME = 'resize';

const EDITING_TOOLS_MAP: Record<EditingTool, (_: CanvasAction) => void> = Object.freeze({
  [EditingTool.Rotation]: drawRotated,
});

const Canvas = ({ imageStr, editingTool }: CanvasProps) => {
  const [mouseInfo, setMouseInfo] = useState<MouseInfo>({ x: 0, y: 0, angle: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [imageDimensions, setImageDimensions] = useState<Size>({ width: 0, height: 0 });
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const canvasAction = useMemo(
    () => (editingTool == undefined ? undefined : EDITING_TOOLS_MAP[editingTool]),
    [editingTool]
  );

  const getCanvas = useCallback(() => canvasRef.current, [canvasRef]);

  const getCtx = useCallback(() => {
    const canvas = getCanvas();
    if (!canvas) {
      return null;
    }

    return canvas.getContext('2d');
  }, [getCanvas]);

  const resizeCanvas = useCallback(
    (imageWidth: number, imageHeight: number) =>
      resizeCanvasToParent({ canvas: getCanvas(), ctx: getCtx(), imageWidth, imageHeight, imageStr }),
    [getCanvas, getCtx, imageStr]
  );

  const resizeListener = useCallback(
    () => resizeCanvas(imageDimensions.width, imageDimensions.height),
    [imageDimensions.height, imageDimensions.width, resizeCanvas]
  );

  const mouseListener = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const canvas = getCanvas();

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
    },
    [getCanvas]
  );

  const handleMouseDown = () => setIsDragging(true);

  const handleMouseUp = () => setIsDragging(false);

  // Ensure canvas size does not exceed image dimensions
  useEffect(() => {
    const canvas = getCanvas();
    const ctx = getCtx();

    if (!canvas || !ctx) {
      return;
    }

    const image = new Image();
    image.src = imageStr;
    image.onload = () => {
      setImageDimensions({ width: image.width, height: image.height });
      resizeCanvas(image.width, image.height);
      setImage(image);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, image.width, image.height);
    };
  }, [getCanvas, getCtx, imageStr, resizeCanvas]);

  // Calculate the new dimensions to fit inside the parent container without exceeding the image size
  useEffect(() => {
    window.addEventListener(RESIZE_EVENT_NAME, resizeListener);

    return () => window.removeEventListener(RESIZE_EVENT_NAME, resizeListener);
  }, [imageDimensions.height, imageDimensions.width, resizeCanvas, resizeListener]);

  useEffect(() => {
    if (isDragging && canvasAction) {
      runCanvasAction({ ctx: getCtx(), canvas: getCanvas(), image, mouse: mouseInfo, canvasAction });
    }
  }, [canvasAction, getCanvas, getCtx, image, isDragging, mouseInfo]);

  return (
    <div
      onMouseMove={mouseListener}
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <canvas onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} ref={canvasRef} />
    </div>
  );
};

export default Canvas;
