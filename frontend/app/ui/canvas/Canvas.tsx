'use client';

import React, {
  Dispatch,
  forwardRef,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AiFunctionType } from '@/app/lib/canvas/ai-functions/definitions';
import { mouseInfoCalc } from '@/app/lib/canvas/basic';
import useChangeHistory from '@/app/lib/canvas/change-history/useChangeHistory';
import { EditingTool, MouseInfo } from '@/app/lib/canvas/definitions';
import { FilterType, filterTypeToFilterFn } from '@/app/lib/canvas/filters/filter';
import useAIImageEditFlow from '@/app/lib/canvas/useAIImageEditFlow';
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
  setCanUndo: Dispatch<SetStateAction<boolean>>;
  setCanRedo: Dispatch<SetStateAction<boolean>>;
  editingTool: EditingTool | undefined;
  aiFunction: AiFunctionType | undefined;
  setCurrentEditComponent: (_: ReactNode | undefined) => void;
};

export type CanvasConsumer = {
  getBlob: (callback: (blob: Blob | null) => void, type?: string, quality?: number) => void;
  undo: () => void;
  redo: () => void;
};

const DEFAULT_ZOOM: number = 1 as const;
const DEFAULT_ROTATION: number = 0 as const;
const DEFAULT_MOUSE_INFO: MouseInfo = Object.freeze({ x: 0, y: 0, angle: 0 } as const);

const ZOOM_STEP: number = 0.1 as const;
const ROTATION_STEP: number = 45 as const;
const CHANGE_HISTORY_LENGTH: number = 25 as const;

const Canvas = forwardRef<CanvasConsumer, CanvasProps>(
  (
    {
      imageStr: passedInImageStr,
      setCanUndo,
      setCanRedo,
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

    const {
      current: imageStr,
      setCurrent: setImageStr,
      undo,
      redo,
      canUndo,
      canRedo,
    } = useChangeHistory(CHANGE_HISTORY_LENGTH, passedInImageStr);
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    const [zoomValue, setZoomValue] = useState<number>(DEFAULT_ZOOM);
    const [rotationValue, setRotationValue] = useState<number>(DEFAULT_ROTATION);

    const [mouseInfo, setMouseInfo] = useState<MouseInfo>(DEFAULT_MOUSE_INFO);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const [isPromptModalVisible, setPromptModalVisible] = useState<boolean>(false);

    const openMaskTool = useCallback(() => setEditingTool(EditingTool.Wand), []);
    const openPrompt = useCallback(() => setPromptModalVisible(true), []);
    const finishFlow = useCallback(() => {
      setAiFunction(undefined);
      setEditingTool(undefined);
    }, []);

    const { setPrompt, setMaskFile } = useAIImageEditFlow({
      aiFunction,
      openMaskTool,
      openPrompt,
      cropperRef,
      finishFlow,
      setResult: (downloadedImageFile) => setImageStr(URL.createObjectURL(downloadedImageFile)),
    });

    const mouseListener = useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
        mouseInfoCalc({ event, parent: parentRef.current, setMouseInfo }),
      []
    );

    const handleMouseDown = useCallback(() => setIsDragging(true), []);
    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    const saveCanvasFromCropper = useCallback(() => {
      const croppedCanvas = cropperRef?.current?.cropper?.getCroppedCanvas();
      const croppedImageUrl = croppedCanvas?.toDataURL();

      if (croppedImageUrl) {
        setImageStr(croppedImageUrl);
      }
    }, [setImageStr]);

    const handleMask = useCallback(
      () =>
        maskGenRef?.current?.getBlob((maskBlob) => {
          if (!maskBlob) {
            return;
          }

          const maskFile = getFileFromBlob(maskBlob, 'mask.png');

          setMaskFile(maskFile);
        }),
      [setMaskFile]
    );

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
        [EditingTool.Crop]: <CropTray handleCrop={saveCanvasFromCropper} />,
        [EditingTool.Move]: false,
        [EditingTool.Filter]: <FilterTray setFilterType={setFilterType} />,
        [EditingTool.Wand]: <WandTray clearMask={() => maskGenRef.current?.clearMask?.()} acceptMask={handleMask} />,
      }),
      [handleMask, saveCanvasFromCropper, rotationValue, zoomValue]
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
    }, [zoomValue, imageStr]);

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

      setFilterType(undefined);

      setImageStr(convertImageDataToImageStr(res));
    }, [editingTool, filterType, getImageData, setImageStr]);

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

    // can redo for parent
    useEffect(() => setCanRedo(canRedo), [canRedo, setCanRedo]);

    // can undo for parent
    useEffect(() => setCanUndo(canUndo), [canUndo, setCanUndo]);

    useImperativeHandle(blobConsumer, () => ({
      getBlob: (callback, type, quality) => {
        const res = cropperRef?.current?.cropper?.getCroppedCanvas();

        if (res) {
          res.toBlob(callback, type, quality);
        } else {
          callback(null);
        }
      },
      undo,
      redo,
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
