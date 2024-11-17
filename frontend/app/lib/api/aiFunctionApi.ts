import { postCall } from './apiUtils';
import { AiFunctionType } from '../canvas/ai-functions/definitions';

type CallAiFunctionParams = {
  originalFile: File;
  maskFile?: File;
  aiFunction: AiFunctionType;
  prompt?: string;
};

type ColorizeImageParams = {
  originalFile: File;
};

type DeleteObjectFromImageParams = {
  originalFile: File;
  maskFile: File;
};

type AddObjectParams = {
  originalFile: File;
  maskFile: File;
  prompt: string;
};

type TransferStyleParams = {
  originalFile: File;
  prompt: string;
};

type UpscaleImageParams = {
  originalFile: File;
};

const AI_ENDPOINT = '/ai' as const;

const getAiFunction = async ({ aiFunction, originalFile, maskFile, prompt }: CallAiFunctionParams) => {
  const formData = new FormData();

  formData.append('original_file', originalFile);

  if (maskFile) {
    formData.append('mask_file', maskFile);
  }

  const queryParams = new URLSearchParams();

  if (prompt) {
    queryParams.append('prompt', prompt);
  }

  return await postCall<Blob>(`${AI_ENDPOINT}/${aiFunction}?${queryParams.toString()}`, formData);
};

export const getColorizedImage = async (props: ColorizeImageParams) =>
  await getAiFunction({ ...props, aiFunction: AiFunctionType.ColorizeImage });

export const getDeleteObjectFromImage = async (props: DeleteObjectFromImageParams) =>
  await getAiFunction({ ...props, aiFunction: AiFunctionType.DeleteObject });

export const getAddObjectToImage = async (props: AddObjectParams) =>
  await getAiFunction({ ...props, aiFunction: AiFunctionType.AddObject });

export const getTransferStyleImage = async (props: TransferStyleParams) =>
  await getAiFunction({ ...props, aiFunction: AiFunctionType.TransferStyle });

export const getUpscaledImage = async (props: UpscaleImageParams) =>
  await getAiFunction({ ...props, aiFunction: AiFunctionType.Upscale });
