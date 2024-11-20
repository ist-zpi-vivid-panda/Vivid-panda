'use client';

import { forwardRef, MutableRefObject, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { mouseInfoCalc, resizeCanvasToParent } from '@/app/lib/canvas/basic';
import { MouseInfo } from '@/app/lib/canvas/definitions';
import Image from 'next/image';

type ImageMaskGeneratorProps = {
  image: HTMLImageElement;
  imageStr: string;
  parentRef: MutableRefObject<HTMLDivElement | null>;
};

export type MaskConsumer = {
  clearMask: () => void;
  getBlob: (callback: (blob: Blob | null) => void, type?: string, quality?: number) => void;
};

type Size = {
  width: number;
  height: number;
};

const DEFAULT_SIZE: Size = Object.freeze({ width: 0, height: 0 } as const);
const DEFAULT_MOUSE_INFO: MouseInfo = Object.freeze({ x: 0, y: 0, angle: 0 } as const);

const ImageMaskGenerator = forwardRef<MaskConsumer, ImageMaskGeneratorProps>(
  ({ image, imageStr, parentRef }, maskConsumer) => {
    const maskCanvas = useRef<HTMLCanvasElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [size, setSize] = useState<Size>(DEFAULT_SIZE);
    const [mouseInfo, setMouseInfo] = useState<MouseInfo>(DEFAULT_MOUSE_INFO);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const handleMouseDown = useCallback(() => setIsDragging(true), []);
    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    const getCtx = useCallback(() => {
      const canvas = maskCanvas?.current;

      if (!canvas) {
        return null;
      }

      return canvas.getContext('2d');
    }, []);

    const clearCanvas = useCallback(() => {
      const canvas = maskCanvas.current;

      const ctx = getCtx();

      if (!ctx || !canvas) {
        return;
      }

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, [getCtx]);

    const draw = useCallback(
      (mouseInfo: MouseInfo) => {
        const ctx = getCtx();

        if (!ctx) {
          return;
        }

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(mouseInfo.x, mouseInfo.y, 20, 0, Math.PI * 2);
        ctx.fill();
      },
      [getCtx]
    );

    const resizeListener = useCallback(() => {
      const res = resizeCanvasToParent({ canvas: maskCanvas?.current, ctx: getCtx(), image });

      if (res) {
        setSize(res);
      }
    }, [getCtx, image]);

    const mouseListener = useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
        mouseInfoCalc({ event, parent: imageRef.current, setMouseInfo }),
      []
    );

    useEffect(() => {
      clearCanvas();
    }, [clearCanvas]);

    useEffect(() => {
      if (isDragging) {
        draw(mouseInfo);
      }
    }, [draw, isDragging, mouseInfo]);

    useEffect(() => {
      const parent = parentRef?.current;

      if (!parent) {
        return;
      }

      const observer = new ResizeObserver(resizeListener);

      observer.observe(parent);

      return () => observer.disconnect();
    }, [parentRef, resizeListener]);

    useImperativeHandle(maskConsumer, () => ({
      clearMask: clearCanvas,
      getBlob: (callback, type, quality) => {
        const res = maskCanvas?.current;

        if (res) {
          res.toBlob(callback, type, quality);
        } else {
          callback(null);
        }
      },
    }));

    return (
      <>
        <div
          onPointerDown={handleMouseDown}
          onPointerUp={handleMouseUp}
          onPointerLeave={handleMouseUp}
          onPointerMove={mouseListener}
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            background: 'black',
          }}
        >
          <Image ref={imageRef} src={imageStr} alt="Mask Background" width={size.width} height={size.height} />

          <canvas
            ref={maskCanvas}
            className="pointer-events-none"
            style={{
              position: 'absolute',
              cursor: 'crosshair',
              opacity: 0.3,
              background: 'black',
            }}
          />
        </div>
      </>
    );
  }
);

ImageMaskGenerator.displayName = 'ImageMaskGeneratorFR';

export default ImageMaskGenerator;
