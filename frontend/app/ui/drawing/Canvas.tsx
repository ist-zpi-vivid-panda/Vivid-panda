'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type CanvasProps = {
  imageStr: string;
};

const Canvas = ({ imageStr }: CanvasProps) => {
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
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  }, [getCanvas, getCtx, imageStr]);

  return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="flex flex-1" />;
};

export default Canvas;
