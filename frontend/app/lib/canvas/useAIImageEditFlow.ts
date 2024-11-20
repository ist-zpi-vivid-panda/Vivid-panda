'use client';

import { MutableRefObject, useEffect, useMemo, useState } from 'react';

import { ReactCropperElement } from 'react-cropper';

import { AiFunctionType } from './ai-functions/definitions';
import {
  AI_FUNCTION_REQUIRED_MASK,
  AI_FUNCTION_REQUIRED_PROMPT,
  AI_FUNCTION_REQUIRED_STYLE,
  AI_FUNCTION_TO_API_CALL,
} from './ai-functions/mappings';
import { getFileFromBlob } from '../files/utils';

type UseAIImageEditProps = {
  aiFunction: AiFunctionType | undefined;
  cropperRef: MutableRefObject<ReactCropperElement | null>;
  openMaskTool: () => void;
  openPrompt: () => void;
  finishFlow: () => void;
  setResult: (_: Blob) => void;
};

const START_PROMPT: string = '' as const;

const useAIImageEditFlow = ({
  aiFunction,
  openMaskTool,
  openPrompt,
  cropperRef,
  finishFlow,
  setResult,
}: UseAIImageEditProps) => {
  const [maskFile, setMaskFile] = useState<File | undefined>(undefined);
  const [prompt, setPrompt] = useState<string>(START_PROMPT);
  const [isLoading, setLoading] = useState<boolean>(false);

  const isMaskRequired = useMemo(() => (aiFunction ? AI_FUNCTION_REQUIRED_MASK[aiFunction] : false), [aiFunction]);
  const isPromptRequired = useMemo(
    () => (aiFunction ? AI_FUNCTION_REQUIRED_PROMPT[aiFunction] || AI_FUNCTION_REQUIRED_STYLE[aiFunction] : false),
    [aiFunction]
  );

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

    setLoading(true);

    cropperRef?.current?.cropper?.getCroppedCanvas()?.toBlob(async (currBlob) => {
      if (!currBlob) {
        return;
      }

      const originalFile = getFileFromBlob(currBlob, 'original_image.png');

      const resMaskFile = maskFile;
      const resPrompt = prompt;

      finishFlow();
      setMaskFile(undefined);
      setPrompt(START_PROMPT);

      try {
        const result = await AI_FUNCTION_TO_API_CALL[aiFunction]({
          prompt: resPrompt,
          originalFile,
          maskFile: resMaskFile,
        });

        if (result) {
          setResult(result);
        }
      } catch {
        /* empty */
      }

      setLoading(false);
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
    setResult,
  ]);

  return { setPrompt, setMaskFile, isLoading };
};

export default useAIImageEditFlow;
