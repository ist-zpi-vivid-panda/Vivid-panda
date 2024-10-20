'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { mouseInfoSetter, resizeCanvasToParent, createCanvasAction } from '@/app/lib/canvas/basic';
import { drawRotated } from '@/app/lib/canvas/rotation';
import { CanvasAction, EditingTool, MouseInfo, RepeatableCanvasAction } from '@/app/lib/canvas/types';

type CanvasProps = {
  imageStr: string;
  editingTool: EditingTool | undefined;
};

const RESIZE_EVENT_NAME = 'resize';

const DEFAULT_CANVAS_OPERATIONS: Record<EditingTool, (_: RepeatableCanvasAction) => void> = Object.freeze({
  [EditingTool.Rotation]: () => {},
});

const EDITING_TOOLS_MAP: Record<EditingTool, (_: CanvasAction) => void> = Object.freeze({
  [EditingTool.Rotation]: drawRotated,
});

const Canvas = ({ imageStr, editingTool }: CanvasProps) => {
  const [mouseInfo, setMouseInfo] = useState<MouseInfo>({ x: 0, y: 0, angle: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getCanvas = useCallback(() => canvasRef.current, [canvasRef]);

  const [canvasOperations, setCanvasOperations] =
    useState<Record<EditingTool, (_: RepeatableCanvasAction) => void>>(DEFAULT_CANVAS_OPERATIONS);

  const canvasAction = useMemo(
    () => (editingTool == undefined ? undefined : EDITING_TOOLS_MAP[editingTool]),
    [editingTool]
  );

  const getCtx = useCallback(() => {
    const canvas = getCanvas();
    if (!canvas) {
      return null;
    }

    return canvas.getContext('2d');
  }, [getCanvas]);

  const resizeListener = useCallback(
    () => resizeCanvasToParent({ canvas: getCanvas(), ctx: getCtx(), image, canvasOperations }),
    [canvasOperations, getCanvas, getCtx, image]
  );

  const mouseListener = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
      mouseInfoSetter({ event, canvas: getCanvas(), setMouseInfo }),
    [getCanvas]
  );

  const handleMouseDown = useCallback(() => setIsDragging(true), []);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    const canvas = getCanvas();
    const ctx = getCtx();

    if (!canvas || !ctx) {
      return;
    }

    const image = new Image();
    image.src = imageStr;
    image.onload = () => setImage(image);
  }, [getCanvas, getCtx, imageStr]);

  useEffect(() => {
    window.addEventListener(RESIZE_EVENT_NAME, resizeListener);

    return () => window.removeEventListener(RESIZE_EVENT_NAME, resizeListener);
  }, [resizeListener]);

  useEffect(() => {
    const canvas = getCanvas();
    const ctx = getCtx();

    if (!isDragging || !canvasAction || !image || !canvas || !ctx) {
      return;
    }

    const res = createCanvasAction({
      mouseInfo,
      canvasAction,
    });

    if (!res) {
      return;
    }

    res({ canvas, image, ctx });

    setCanvasOperations((prev) => ({ ...prev, editingTool: res }));
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
