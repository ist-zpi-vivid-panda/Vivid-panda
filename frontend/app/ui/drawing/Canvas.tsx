'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type CanvasProps = {
  imageStr: string;
};

type Size = {
  width: number;
  height: number;
};

const Canvas = ({ imageStr }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageDimensions, setImageDimensions] = useState<Size>({ width: 0, height: 0 });

  const getCanvas = useCallback(() => canvasRef.current, [canvasRef]);

  const getCtx = useCallback(() => {
    const canvas = getCanvas();
    if (canvas) {
      return canvas.getContext('2d');
    }
  }, [getCanvas]);

  // Ensure canvas size does not exceed image dimensions
  useEffect(() => {
    const canvas = getCanvas();
    const ctx = getCtx();

    if (!imageStr || !canvas || !ctx) {
      return;
    }

    const image = new Image();
    image.src = imageStr;

    image.onload = () => {
      setImageDimensions({ width: image.width, height: image.height });

      canvas.width = image.width;
      canvas.height = image.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, image.width, image.height);
    };
  }, [getCanvas, getCtx, imageStr]);

  // Calculate the new dimensions to fit inside the parent container without exceeding the image size
  useEffect(() => {
    const canvas = getCanvas();

    if (!canvas) {
      return;
    }

    const resizeCanvas = () => {
      if (!imageDimensions.width || !imageDimensions.height) {
        return;
      }

      const parent = canvas.parentElement;

      if (!parent) {
        return;
      }

      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;

      const aspectRatio = imageDimensions.width / imageDimensions.height;

      let newWidth = Math.min(parentWidth, imageDimensions.width);
      let newHeight = Math.min(parentHeight, imageDimensions.height);

      if (newWidth / newHeight > aspectRatio) {
        newWidth = newHeight * aspectRatio;
      } else {
        newHeight = newWidth / aspectRatio;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = getCtx();
      if (!ctx) {
        return;
      }

      const image = new Image();
      image.src = imageStr;
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, newWidth, newHeight);
      };
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [getCanvas, getCtx, imageStr, imageDimensions]);

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
