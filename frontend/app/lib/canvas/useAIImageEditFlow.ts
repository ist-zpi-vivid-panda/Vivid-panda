'use client';

import { MutableRefObject, useEffect, useMemo, useState } from 'react';

import { ReactCropperElement } from 'react-cropper';

import { AiFunctionType } from './ai-functions/definitions';
import {
  AI_FUNCTION_REQUIRED_MASK,
  AI_FUNCTION_REQUIRED_PROMPT,
  AI_FUNCTION_TO_API_CALL,
} from './ai-functions/mappings';
import { getFileFromBlob } from '../files/utils';

type UseAIImageEditProps = {
  aiFunction: AiFunctionType | undefined;
  cropperRef: MutableRefObject<ReactCropperElement | null>;
  openMaskTool: () => void;
  openPrompt: () => void;
  finishFlow: () => void;
};

const useAIImageEditFlow = ({ aiFunction, openMaskTool, openPrompt, cropperRef, finishFlow }: UseAIImageEditProps) => {
  const [maskFile, setMaskFile] = useState<File | undefined>(undefined);
  const [prompt, setPrompt] = useState<string>('');

  const isMaskRequired = useMemo(() => (aiFunction ? AI_FUNCTION_REQUIRED_MASK[aiFunction] : false), [aiFunction]);
  const isPromptRequired = useMemo(() => (aiFunction ? AI_FUNCTION_REQUIRED_PROMPT[aiFunction] : false), [aiFunction]);

  useEffect(() => {
    if (!aiFunction) {
      return;
    }

    if (isMaskRequired && !maskFile) {
      openMaskTool();
      return;
    }

    if (isPromptRequired && !prompt) {
      openPrompt();
      return;
    }

    cropperRef?.current?.cropper?.getCroppedCanvas()?.toBlob((currBlob) => {
      finishFlow();

      if (!currBlob) {
        return;
      }

      const originalFile = getFileFromBlob(currBlob, 'original_image.png');

      AI_FUNCTION_TO_API_CALL[aiFunction]({
        prompt,
        originalFile,
        maskFile: maskFile!,
      });

      setMaskFile(undefined);
      setPrompt('');
    });
  }, [
    aiFunction,
    cropperRef,
    finishFlow,
    isMaskRequired,
    isPromptRequired,
    maskFile,
    openMaskTool,
    openPrompt,
    prompt,
  ]);

  return { setPrompt, setMaskFile };
};

export default useAIImageEditFlow;
