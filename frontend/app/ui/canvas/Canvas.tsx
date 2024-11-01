'use client';

import { forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { mouseInfoCalc } from '@/app/lib/canvas/basic';
import { FilterType, filterTypeToFilterFn } from '@/app/lib/canvas/filters/filter';
import { EditingTool, MouseInfo } from '@/app/lib/canvas/types';
import { convertImageDataToImageStr } from '@/app/lib/utilities/image';
import { Cropper, ReactCropperElement } from 'react-cropper';

import CropTray from './tool-trays/CropTray';
import FilterTray from './tool-trays/FilterTray';
import RotationTray from './tool-trays/RotationTray';
import ZoomTray from './tool-trays/ZoomTray';

type CanvasProps = {
  imageStr: string;
  editingTool: EditingTool | undefined;
  setCurrentEditComponent: (_: ReactNode | undefined) => void;
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
    const [rotationValue, setRotationValue] = useState<number>(DEFAULT_ROTATION);
    const [filterType, setFilterType] = useState<FilterType | undefined>(undefined);

    const [mouseInfo, setMouseInfo] = useState<MouseInfo>(DEFAULT_MOUSE_INFO);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const mouseListener = useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
        mouseInfoCalc({ event, parent: parentRef.current, setMouseInfo }),
      []
    );

    const handleMouseDown = useCallback(() => setIsDragging(true), []);
    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    const rotate = useCallback((angle: number) => setRotationValue(angle), []);

    const handleCrop = useCallback(() => {
      const croppedCanvas = cropperRef?.current?.cropper?.getCroppedCanvas();
      const croppedImageUrl = croppedCanvas?.toDataURL();

      if (croppedImageUrl) {
        setImageStr(croppedImageUrl);
      }
    }, []);

    const getImageData = useCallback((): ImageData | undefined => {
      const croppedCanvas = cropperRef.current?.cropper?.getCroppedCanvas();
      const ctx = croppedCanvas?.getContext('2d');

      if (!ctx || !croppedCanvas) {
        return;
      }

      return ctx.getImageData(0, 0, croppedCanvas.width, croppedCanvas.height);
    }, []);

    const editComponents: Record<EditingTool, ReactNode> = useMemo(
      () => ({
        [EditingTool.Rotation]: (
          <RotationTray
            rotationStep={ROTATION_STEP}
            setRotation={setRotationValue}
            currentRotation={rotationValue}
            defaultRotation={DEFAULT_ROTATION}
          />
        ),
        [EditingTool.Zoom]: (
          <ZoomTray zoomStep={ZOOM_STEP} setZoom={setZoomValue} currentZoom={zoomValue} defaultZoom={DEFAULT_ZOOM} />
        ),
        [EditingTool.Crop]: <CropTray handleCrop={handleCrop} />,
        [EditingTool.Move]: false,
        [EditingTool.Filter]: <FilterTray setFilterType={setFilterType} />,
      }),
      [handleCrop, rotationValue, zoomValue]
    );

    // change params according to tool
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
      setCurrentEditComponent(editingTool ? editComponents[editingTool] : false);
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
      cropperRef?.current?.cropper?.rotateTo(rotationValue);
    }, [rotationValue]);

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

    // filter
    useEffect(() => {
      if (!filterType || editingTool !== EditingTool.Filter) {
        return;
      }

      const imageData = getImageData();

      if (!imageData) {
        return;
      }

      const res = filterTypeToFilterFn[filterType]({
        imageData,
        startPointX: 0,
        startPointY: 0,
        endPointX: imageData.width,
        endPointY: imageData.height,
      });

      setImageStr(convertImageDataToImageStr(res));
    }, [editingTool, filterType, getImageData]);

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
