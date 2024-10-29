'use client';

import { forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { mouseInfoCalc } from '@/app/lib/canvas/basic';
import { EditingTool, MouseInfo } from '@/app/lib/canvas/types';
import { Cropper, ReactCropperElement } from 'react-cropper';

type CanvasProps = {
  imageStr: string;
  editingTool: EditingTool | undefined;
  setCurrentEditComponent: (_: ReactNode) => void;
};

export type BlobConsumer = {
  getBlob: (callback: (blob: Blob | null) => void, type?: string, quality?: number) => void;
};

const DEFAULT_ZOOM: number = 1 as const;
const DEFAULT_ROTATION: number = 0 as const;
const DEFAULT_MOUSE_INFO: MouseInfo = Object.freeze({ x: 0, y: 0, angle: 0 } as const);

const ZOOM_STEP: number = 0.1 as const;
const ROTATION_STEP: number = 45 as const;

const Canvas = forwardRef<BlobConsumer, CanvasProps>(
  ({ imageStr: passedInImageStr, editingTool, setCurrentEditComponent }, blobConsumer) => {
    const parentRef = useRef<HTMLDivElement | null>(null);
    const cropperRef = useRef<ReactCropperElement | null>(null);

    const [imageStr, setImageStr] = useState<string>(passedInImageStr);

    const [zoomValue, setZoomValue] = useState<number>(DEFAULT_ZOOM);
    const [rotation, setRotation] = useState<number>(DEFAULT_ROTATION);

    const [mouseInfo, setMouseInfo] = useState<MouseInfo>(DEFAULT_MOUSE_INFO);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const handleMouseDown = useCallback(() => setIsDragging(true), []);
    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    const rotateBy = useCallback((angleBy: number) => setRotation((prevAngle) => prevAngle + angleBy), []);
    const rotate = useCallback((angle: number) => setRotation(angle), []);

    const zoomBy = useCallback((zoomBy: number) => setZoomValue((prevZoom) => prevZoom + zoomBy), []);
    const zoom = useCallback((newZoomValue: number) => setZoomValue(newZoomValue), []);

    const handleCrop = () => {
      const croppedCanvas = cropperRef?.current?.cropper?.getCroppedCanvas();
      const croppedImageUrl = croppedCanvas?.toDataURL();

      if (croppedImageUrl) {
        setImageStr(croppedImageUrl);
      }
    };

    const editComponents: Record<EditingTool, ReactNode> = useMemo(
      () => ({
        [EditingTool.Rotation]: (
          <div>
            <button onClick={() => rotateBy(ROTATION_STEP)}>Rotate by {ROTATION_STEP}°</button>

            <button onClick={() => rotateBy(-ROTATION_STEP)}>Rotate by -{ROTATION_STEP}°</button>
          </div>
        ),
        [EditingTool.Zoom]: (
          <div>
            <button onClick={() => zoomBy(ZOOM_STEP)}>+</button>

            <button onClick={() => zoomBy(-ZOOM_STEP)}>-</button>
          </div>
        ),
        [EditingTool.Crop]: (
          <div>
            <button onClick={handleCrop}>Crop</button>
          </div>
        ),
        [EditingTool.Move]: <div />,
      }),
      [rotateBy, zoomBy]
    );

    const mouseListener = useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
        mouseInfoCalc({ event, parent: parentRef.current, setMouseInfo }),
      []
    );

    // change tool
    useEffect(() => {
      const cropper = cropperRef?.current?.cropper;

      if (!cropper) {
        return;
      }

      cropper.setDragMode(
        editingTool === EditingTool.Crop ? 'crop' : editingTool === EditingTool.Move ? 'move' : 'none'
      );

      if (editingTool !== EditingTool.Crop) {
        cropper.clear();
      } else {
        cropper.crop();
      }
    }, [editingTool]);

    // get current change component
    useEffect(() => {
      if (!editingTool) {
        return;
      }

      setCurrentEditComponent(editComponents[editingTool]);
    }, [editComponents, editingTool, setCurrentEditComponent]);

    // while dragging mouse
    useEffect(() => {
      if (!isDragging) {
        return;
      }

      if (editingTool === EditingTool.Rotation) {
        rotate(mouseInfo.angle);
      }
    }, [editingTool, isDragging, mouseInfo.angle, rotate]);

    // rotate
    useEffect(() => {
      cropperRef?.current?.cropper?.rotateTo(rotation);
    }, [rotation]);

    // zoom
    useEffect(() => {
      // for some reason only zoomTo has a problem with width not being initialized
      if (
        !cropperRef! ||
        !cropperRef.current ||
        !cropperRef.current.cropper ||
        !cropperRef.current.currentSrc ||
        !cropperRef?.current?.width
      ) {
        return;
      }

      cropperRef?.current?.cropper?.zoomTo(zoomValue);
    }, [zoomValue]);

    useImperativeHandle(blobConsumer, () => ({
      getBlob: (callback, type, quality) => {
        const res = cropperRef?.current?.cropper?.getCroppedCanvas();

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
          // begin :: listeners
          onPointerDown={handleMouseDown}
          onPointerUp={handleMouseUp}
          onPointerLeave={handleMouseUp}
          onPointerMove={mouseListener}
          // end :: listeners
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          ref={parentRef}
        >
          <Cropper
            src={imageStr}
            style={{ width: '100%', height: '100%' }}
            // begin:: Cropper.js options
            dragMode="none"
            viewMode={1}
            autoCrop={false}
            toggleDragModeOnDblclick={false}
            restore={false}
            guides={false}
            responsive={true}
            modal={true}
            background={true}
            ref={cropperRef}
            // end:: Cropper.js options
          />
        </div>
      </>
    );
  }
);

Canvas.displayName = 'CanvasFR';

export default Canvas;
