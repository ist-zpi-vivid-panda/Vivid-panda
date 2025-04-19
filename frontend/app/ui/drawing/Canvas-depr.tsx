'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { mouseInfoSetter, resizeCanvasToParent, createCanvasAction } from '@/app/lib/canvas/basic-depr';
import { drawRotated } from '@/app/lib/canvas/rotation';
import { CanvasAction, EditingTool, MouseInfo, RepeatableCanvasAction } from '@/app/lib/canvas/types';

type CanvasProps = {
  imageStr: string;
  editingTool: EditingTool | undefined;
};

type CanvasOperation = Record<EditingTool, (_: RepeatableCanvasAction) => void>;

const DEFAULT_MOUSE_INFO: MouseInfo = Object.freeze({ x: 0, y: 0, angle: 0 });

const DEFAULT_CANVAS_OPERATIONS: CanvasOperation = Object.freeze({
  [EditingTool.Rotation]: () => {},
  [EditingTool.Zoom]: () => {},
  [EditingTool.Move]: () => {},
  [EditingTool.Crop]: () => {},
});

const EDITING_TOOLS_MAP: Record<EditingTool, (_: CanvasAction) => void> = Object.freeze({
  [EditingTool.Rotation]: drawRotated,
  [EditingTool.Zoom]: () => {},
  [EditingTool.Move]: () => {},
  [EditingTool.Crop]: () => {},
});

const CanvasDepr = ({ imageStr, editingTool }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasParentRef = useRef<HTMLDivElement | null>(null);

  const [mouseInfo, setMouseInfo] = useState<MouseInfo>(DEFAULT_MOUSE_INFO);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [canvasOperations, setCanvasOperations] = useState<CanvasOperation>(DEFAULT_CANVAS_OPERATIONS);

  const canvasAction = useMemo(
    () => (editingTool === undefined ? undefined : EDITING_TOOLS_MAP[editingTool]),
    [editingTool]
  );

  const handleMouseDown = useCallback(() => setIsDragging(true), []);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const getCtx = useCallback(() => {
    const canvas = canvasRef?.current;
    if (!canvas) {
      return null;
    }

    return canvas.getContext('2d');
  }, []);

  const resizeListener = useCallback(
    () => resizeCanvasToParent({ canvas: canvasRef?.current, ctx: getCtx(), image, canvasOperations }),
    [canvasOperations, getCtx, image]
  );

  const mouseListener = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
      mouseInfoSetter({ event, canvas: canvasRef?.current, setMouseInfo }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef?.current;
    const ctx = getCtx();

    if (!canvas || !ctx) {
      return;
    }

    const image = new Image();
    image.src = imageStr;
    image.onload = () => setImage(image);
  }, [getCtx, imageStr]);

  useEffect(() => {
    const parent = canvasParentRef?.current;

    if (!parent) {
      return;
    }

    const observer = new ResizeObserver(resizeListener);

    observer.observe(parent);

    return () => observer.disconnect();
  }, [resizeListener]);

  useEffect(() => {
    const canvas = canvasRef?.current;
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
  }, [canvasAction, getCtx, image, isDragging, mouseInfo]);

  return (
    <div
      ref={canvasParentRef}
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

export default CanvasDepr;
