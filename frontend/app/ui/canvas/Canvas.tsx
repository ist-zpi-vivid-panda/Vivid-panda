'use client';

import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { mouseInfoCalc } from '@/app/lib/canvas/basic';
import { EditingTool, MouseInfo } from '@/app/lib/canvas/definitions';
import { FilterType, filterTypeToFilterFn } from '@/app/lib/canvas/filters/filter';
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
    const [maskImage, setMaskImage] = useState<string | null>(null);

    const [imageStr, setImageStr] = useState<string>(passedInImageStr);
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    const [zoomValue, setZoomValue] = useState<number>(DEFAULT_ZOOM);
    const [rotationValue, setRotationValue] = useState<number>(DEFAULT_ROTATION);
    const [filterType, setFilterType] = useState<FilterType | undefined>(undefined);

    const [mouseInfo, setMouseInfo] = useState<MouseInfo>(DEFAULT_MOUSE_INFO);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [maskCanvas, setMaskCanvas] = useState<HTMLCanvasElement | null>(null);

    const [isMaskDrawing, setIsMaskDrawing] = useState<boolean>(false);

    // Function to draw the mask on the maskCanvas
    const drawMask = useCallback(
      (x: number, y: number) => {
        if (!maskCanvas) return;
        const ctx = maskCanvas.getContext('2d');
        if (!ctx) return;

        // Set the stroke style for freehand drawing (mask drawing)
        ctx.lineWidth = 5; // Adjust line width as needed
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)'; // Full black to represent the mask area
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw the path if the user is dragging
        if (isDragging) {
          ctx.lineTo(x, y); // Draw a continuous line
          ctx.stroke();
        } else {
          // Begin a new path when the user first starts dragging
          ctx.beginPath();
          ctx.moveTo(x, y);
        }
      },
      [maskCanvas, isDragging]
    );

    const mouseListener = useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        mouseInfoCalc({ event, parent: parentRef.current, setMouseInfo });

        // Draw mask if dragging
        if (isDragging && isMaskDrawing) {
          const rect = parentRef.current?.getBoundingClientRect();
          if (rect) {
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            drawMask(x, y);
          }
        }
      },
      [drawMask, isDragging, isMaskDrawing]
    );

    useEffect(() => {
      // Wait for image and cropper to be fully loaded before initializing maskCanvas
      if (cropperRef.current && cropperRef.current.cropper) {
        const cropperCanvas = cropperRef.current.cropper.getCroppedCanvas();

        if (cropperCanvas) {
          const canvas = document.createElement('canvas');
          canvas.width = cropperCanvas.width;
          canvas.height = cropperCanvas.height;
          console.log(canvas);
          setMaskCanvas(canvas); // Initialize maskCanvas with correct size
        }
      }
    }, [imageStr, cropperRef.current]); // Re-run when image or cropperRef changes

    const handleMouseDown = useCallback(() => {
      setIsDragging(true);
      setIsMaskDrawing(true);
    }, []);
    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
      setIsMaskDrawing(false);
    }, []);

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

    useEffect(() => {
      const image = new Image();
      image.src = imageStr;
      image.onload = () => setImage(image);
    }, [imageStr]);

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

    const generateMask = () => {
      if (maskCanvas) {
        console.log('generate');
        const size = maskCanvas.width;
        const ctx = maskCanvas.getContext('2d');

        if (!ctx) {
          return;
        }

        // Retrieve the image data from the maskCanvas (the drawn mask)
        const imageData = ctx.getImageData(0, 0, size, size);

        // Create a new image data array for the binary mask
        const binaryMaskData = ctx.createImageData(size, size);

        // Process the image data to convert it to a binary mask
        for (let i = 0; i < imageData.data.length; i += 4) {
          // Check if the pixel is "drawn" (non-transparent)
          const alpha = imageData.data[i + 3]; // Alpha channel
          const bitValue = alpha > 0 ? 255 : 0; // Black if drawn, white if not

          // Set the binary mask pixel
          binaryMaskData.data[i] = bitValue; // Red channel
          binaryMaskData.data[i + 1] = bitValue; // Green channel
          binaryMaskData.data[i + 2] = bitValue; // Blue channel
          binaryMaskData.data[i + 3] = 255; // Full opacity (alpha channel)
        }

        // Put the processed binary mask image data back into the canvas
        ctx.putImageData(binaryMaskData, 0, 0);

        // Convert the mask canvas to a URL and save it in state
        setMaskImage(maskCanvas.toDataURL()); // Now this is just the drawn mask
      }
    };

    const toggleMaskEditor = () => {
      setIsMaskDrawing((prev) => !prev);
    };

    return (
      <>
        <div
          onPointerDown={handleMouseDown}
          onPointerUp={handleMouseUp}
          onPointerLeave={handleMouseUp}
          onPointerMove={mouseListener}
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          ref={parentRef}
        >
          {image && (
            <Cropper
              src={imageStr}
              style={{ width: '100%', height: '100%' }}
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
            />
          )}
          {maskImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={maskImage}
              alt="Generated Mask"
              style={{
                position: 'absolute',
                top: parentRef.current?.offsetTop ?? 0,
                left: parentRef.current?.offsetLeft ?? 0,
                width: parentRef.current?.offsetWidth ?? '100%',
                height: parentRef.current?.offsetHeight ?? '100%',
                zIndex: 2, // Make sure it overlays the Cropper image
                pointerEvents: 'none', // Allows interactions with Cropper behind the mask
              }}
            />
          )}
        </div>
        <button onClick={toggleMaskEditor}>{isMaskDrawing ? 'Stop Drawing Mask' : 'Draw Mask'}</button>
        <button onClick={generateMask}>Generate Mask</button>
      </>
    );
  }
);

Canvas.displayName = 'CanvasFR';

export default Canvas;
