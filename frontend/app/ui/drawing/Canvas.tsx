'use client';

import { useCallback, useEffect, useRef } from 'react';

type CanvasProps = {
  imageStr: string;
  gridSize: { width: number; height: number }; // Add gridSize prop
};

const Canvas = ({ imageStr, gridSize }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getCanvas = useCallback(() => canvasRef.current, [canvasRef]);
  const getCtx = useCallback(() => {
    const canvas = getCanvas();
    if (canvas) {
      return canvas.getContext('2d');
    }
  }, [getCanvas]);

  useEffect(() => {
    const canvas = getCanvas();
    const ctx = getCtx();

    if (!imageStr || !canvas || !ctx) {
      return;
    }

    const image = new Image();
    image.src = imageStr;
    image.onload = () => {
      const canvasWidth = gridSize.width; // Take width from gridSize
      const canvasHeight = gridSize.height; // Take height from gridSize
      const imageWidth = image.width;
      const imageHeight = image.height;

      let width = canvasWidth;
      let height = canvasHeight;

      if (imageWidth > canvasWidth || imageHeight > canvasHeight) {
        // If the image is larger than the canvas, resize it to fit
        if (imageWidth > canvasWidth) {
          height = (imageHeight / imageWidth) * canvasWidth;
          width = canvasWidth;
        } else {
          width = (imageWidth / imageHeight) * canvasHeight;
          height = canvasHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(image, 0, 0, width, height);
    };
  }, [getCanvas, getCtx, imageStr, gridSize]);

  return (
    <canvas
      ref={canvasRef}
      width={gridSize.width} // Set canvas width from gridSize
      height={gridSize.height} // Set canvas height from gridSize
      className="flex flex-1"
    />
  );
};

export default Canvas;
