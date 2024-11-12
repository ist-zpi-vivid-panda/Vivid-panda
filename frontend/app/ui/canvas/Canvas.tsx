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

import { AiFunctionType } from '@/app/lib/canvas/ai-functions/definitions';
import {
  AI_FUNCTION_REQUIRED_MASK,
  AI_FUNCTION_REQUIRED_PROMPT,
  AI_FUNCTION_TO_API_CALL,
  AI_FUNCTIONS_WITH_MASK,
} from '@/app/lib/canvas/ai-functions/mappings';
import { mouseInfoCalc } from '@/app/lib/canvas/basic';
import { EditingTool, MouseInfo } from '@/app/lib/canvas/definitions';
import { FilterType, filterTypeToFilterFn } from '@/app/lib/canvas/filters/filter';
import { getFileFromBlob } from '@/app/lib/files/utils';
import { convertImageDataToImageStr } from '@/app/lib/utilities/image';
import { Cropper, ReactCropperElement } from 'react-cropper';

import ImageMaskGenerator, { MaskConsumer } from './ImageMaskGenerator';
import PromptModal from './PromptModal';
import CropTray from './tool-trays/CropTray';
import FilterTray from './tool-trays/FilterTray';
import RotationTray from './tool-trays/RotationTray';
import WandTray from './tool-trays/WandTray';
import ZoomTray from './tool-trays/ZoomTray';

type CanvasProps = {
  imageStr: string;
  editingTool: EditingTool | undefined;
  aiFunction: AiFunctionType | undefined;
  setCurrentEditComponent: (_: ReactNode | undefined) => void;
};

export type BlobConsumer = {
  getBlob: (callback: (blob: Blob | null) => void, type?: string, quality?: number) => void;
};

const DEFAULT_ZOOM: number = 1 as const;
const DEFAULT_ROTATION: number = 0 as const;
const DEFAULT_MOUSE_INFO: MouseInfo = Object.freeze({ x: 0, y: 0, angle: 0 } as const);
const DEFAULT_CALLBACK = () => {};

const ZOOM_STEP: number = 0.1 as const;
const ROTATION_STEP: number = 45 as const;

const Canvas = forwardRef<BlobConsumer, CanvasProps>(
  (
    {
      imageStr: passedInImageStr,
      setCurrentEditComponent,
      editingTool: editingToolFromParent,
      aiFunction: aiFunctionFromParent,
    },
    blobConsumer
  ) => {
    const parentRef = useRef<HTMLDivElement | null>(null);
    const cropperRef = useRef<ReactCropperElement | null>(null);
    const maskGenRef = useRef<MaskConsumer | null>(null);

    const [editingTool, setEditingTool] = useState<EditingTool | undefined>(editingToolFromParent);
    const [aiFunction, setAiFunction] = useState<AiFunctionType | undefined>(aiFunctionFromParent);
    const [filterType, setFilterType] = useState<FilterType | undefined>(undefined);

    const [imageStr, setImageStr] = useState<string>(passedInImageStr);
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    const [zoomValue, setZoomValue] = useState<number>(DEFAULT_ZOOM);
    const [rotationValue, setRotationValue] = useState<number>(DEFAULT_ROTATION);

    const [mouseInfo, setMouseInfo] = useState<MouseInfo>(DEFAULT_MOUSE_INFO);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const [isPromptModalVisible, setPromptModalVisible] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>('');

    const mouseListener = useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
        mouseInfoCalc({ event, parent: parentRef.current, setMouseInfo }),
      []
    );

    const handleMouseDown = useCallback(() => setIsDragging(true), []);
    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    const handleCrop = useCallback(() => {
      const croppedCanvas = cropperRef?.current?.cropper?.getCroppedCanvas();
      const croppedImageUrl = croppedCanvas?.toDataURL();

      if (croppedImageUrl) {
        setImageStr(croppedImageUrl);
      }
    }, []);

    const handleAiFunctionCall = useCallback(() => {
      if (!aiFunction) {
        return;
      }

      if (AI_FUNCTION_REQUIRED_PROMPT[aiFunction] && !prompt) {
        setPromptModalVisible(true);
      }

      if (AI_FUNCTIONS_WITH_MASK.includes(aiFunction)) {
        maskGenRef.current?.getBlob((maskBlob) =>
          cropperRef?.current?.cropper?.getCroppedCanvas().toBlob((currBlob) => {
            if (!maskBlob || !currBlob) {
              return;
            }

            const maskFile = getFileFromBlob(maskBlob, 'mask');
            const originalFile = getFileFromBlob(currBlob, 'curr');

            AI_FUNCTION_TO_API_CALL[aiFunction]({
              prompt,
              originalFile,
              maskFile,
            });
          })
        );
      }

      setAiFunction(undefined);
    }, [aiFunction, prompt]);

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
        [EditingTool.Wand]: (
          <WandTray clearMask={maskGenRef.current?.clearMask ?? DEFAULT_CALLBACK} acceptMask={handleAiFunctionCall} />
        ),
      }),
      [handleAiFunctionCall, handleCrop, rotationValue, zoomValue]
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
    useEffect(
      () => setCurrentEditComponent(editingTool ? editComponents[editingTool] : false),
      [editComponents, editingTool, setCurrentEditComponent]
    );

    // while dragging mouse
    useEffect(() => {
      if (!isDragging) {
        return;
      }

      if (editingTool === EditingTool.Rotation) {
        setRotationValue(mouseInfo.angle);
      }
    }, [editingTool, isDragging, mouseInfo.angle]);

    // rotate
    useEffect(() => {
      cropperRef?.current?.cropper?.rotateTo(rotationValue);
    }, [rotationValue]);

    // zoom
    useEffect(() => {
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

    // change tool on parent change
    useEffect(() => {
      setEditingTool(editingToolFromParent);
    }, [editingToolFromParent]);

    // change ai function on parent change
    useEffect(() => setAiFunction(aiFunctionFromParent), [aiFunctionFromParent]);

    // on ai tool chosen
    useEffect(() => {
      if (!aiFunction) {
        return;
      }

      if (AI_FUNCTION_REQUIRED_MASK[aiFunction]) {
        setEditingTool(EditingTool.Wand);
      }
    }, [aiFunction]);

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
        <PromptModal
          isOpen={isPromptModalVisible}
          close={() => setPromptModalVisible(false)}
          setPromptText={setPrompt}
        />

        <div
          ref={parentRef}
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
        >
          {image &&
            (editingTool == EditingTool.Wand ? (
              <ImageMaskGenerator imageStr={imageStr} image={image} parentRef={parentRef} ref={maskGenRef} />
            ) : (
              <Cropper
                src={imageStr}
                ref={cropperRef}
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
              />
            ))}
        </div>
      </>
    );
  }
);

Canvas.displayName = 'CanvasFR';

export default Canvas;
