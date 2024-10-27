'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { mouseInfoCalc } from '@/app/lib/canvas/basic';
import { EditingTool, MouseInfo } from '@/app/lib/canvas/types';
import { Cropper, ReactCropperElement } from 'react-cropper';

type CanvasProps = {
  imageStr: string;
  editingTool: EditingTool | undefined;
  getCanvas: (_: HTMLCanvasElement | undefined) => void;
};

const DEFAULT_ZOOM: number = 1 as const;
const DEFAULT_ROTATION: number = 0 as const;
const DEFAULT_MOUSE_INFO: MouseInfo = Object.freeze({ x: 0, y: 0, angle: 0 });

const ZOOM_STEP: number = 0.1 as const;
const ROTATION_STEP: number = 45 as const;

const Canvas = ({ imageStr, editingTool, getCanvas }: CanvasProps) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const [, setZoomValue] = useState<number>(DEFAULT_ZOOM);
  const [, setRotation] = useState<number>(DEFAULT_ROTATION);

  const [mouseInfo, setMouseInfo] = useState<MouseInfo>(DEFAULT_MOUSE_INFO);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleMouseDown = useCallback(() => setIsDragging(true), []);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const rotateBy = useCallback(
    (angleBy: number) =>
      setRotation((prevAngle) => {
        const newAngle = prevAngle + angleBy;
        cropperRef.current?.cropper?.rotateTo(newAngle);

        return newAngle;
      }),
    []
  );

  const rotate = useCallback(
    (angle: number) =>
      setRotation(() => {
        cropperRef.current?.cropper?.rotate(angle);

        return angle;
      }),
    []
  );

  const zoomBy = useCallback(
    (zoomBy: number) =>
      setZoomValue((prevZoom) => {
        const newZoom = prevZoom + zoomBy;
        cropperRef.current?.cropper?.zoomTo(newZoom);

        return newZoom;
      }),
    []
  );

  const mouseListener = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
      mouseInfoCalc({ event, cropper: cropperRef.current, setMouseInfo }),
    []
  );

  useEffect(() => {
    const image = new Image();
    image.src = imageStr;
    image.onload = () => setImage(image);
  }, [imageStr]);

  useEffect(() => {
    getCanvas(cropperRef.current?.cropper?.getCroppedCanvas());
  }, [getCanvas]);

  // change tool
  useEffect(() => {
    const cropper = cropperRef.current?.cropper;

    if (!cropper) {
      return;
    }

    cropper.setDragMode(editingTool === EditingTool.Crop ? 'crop' : editingTool === EditingTool.Move ? 'move' : 'none');

    if (editingTool !== EditingTool.Crop) {
      cropper.clear();
    } else {
      cropper.crop();
    }
  }, [editingTool]);

  // while dragging mouse
  useEffect(() => {
    if (!isDragging) {
      return;
    }

    if (editingTool === EditingTool.Rotation) {
      rotate(mouseInfo.angle);
    }
  }, [editingTool, isDragging, mouseInfo.angle, rotate]);

  return (
    <>
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
        <span>{editingTool}</span>

        {image && (
          <Cropper
            // begin :: listeners
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            // end :: listeners

            src={imageStr}
            style={{ width: '100%', height: '100%' }}
            // begin:: Cropper.js options
            aspectRatio={image.width / image.height}
            ref={cropperRef}
            viewMode={1}
            responsive={false}
            restore={false}
            toggleDragModeOnDblclick={false}
            modal
            background
            // end:: Cropper.js options
          />
        )}
      </div>

      {editingTool === EditingTool.Rotation && (
        <div>
          <button onClick={() => rotateBy(ROTATION_STEP)}>Rotate by {ROTATION_STEP}°</button>

          <button onClick={() => rotateBy(-ROTATION_STEP)}>Rotate by -{ROTATION_STEP}°</button>
        </div>
      )}

      {editingTool === EditingTool.Zoom && (
        <div>
          <span>Zoom:</span>

          <button onClick={() => zoomBy(ZOOM_STEP)}>+</button>

          <button onClick={() => zoomBy(-ZOOM_STEP)}>-</button>
        </div>
      )}
    </>
  );
};

export default Canvas;
