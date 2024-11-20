import { AiFunctionType } from './definitions';
import {
  getAddObjectToImage,
  getColorizedImage,
  getDeleteObjectFromImage,
  getTransferStyleImage,
  getUpscaledImage,
} from '../../api/aiFunctionApi';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AI_FUNCTION_TO_API_CALL: Record<AiFunctionType, (...args: any[]) => Promise<Blob>> = Object.freeze({
  [AiFunctionType.ColorizeImage]: getColorizedImage,
  [AiFunctionType.DeleteObject]: getDeleteObjectFromImage,
  [AiFunctionType.AddObject]: getAddObjectToImage,
  [AiFunctionType.TransferStyle]: getTransferStyleImage,
  [AiFunctionType.Upscale]: getUpscaledImage,
} as const);

export const AI_FUNCTION_REQUIRED_PROMPT: Record<AiFunctionType, boolean> = Object.freeze({
  [AiFunctionType.ColorizeImage]: false,
  [AiFunctionType.DeleteObject]: false,
  [AiFunctionType.AddObject]: true,
  [AiFunctionType.TransferStyle]: false,
  [AiFunctionType.Upscale]: false,
} as const);

export const AI_FUNCTION_REQUIRED_STYLE: Record<AiFunctionType, boolean> = Object.freeze({
  [AiFunctionType.ColorizeImage]: false,
  [AiFunctionType.DeleteObject]: false,
  [AiFunctionType.AddObject]: false,
  [AiFunctionType.TransferStyle]: true,
  [AiFunctionType.Upscale]: false,
} as const);

export const AI_FUNCTION_REQUIRED_MASK: Record<AiFunctionType, boolean> = Object.freeze({
  [AiFunctionType.ColorizeImage]: false,
  [AiFunctionType.DeleteObject]: true,
  [AiFunctionType.AddObject]: true,
  [AiFunctionType.TransferStyle]: false,
  [AiFunctionType.Upscale]: false,
} as const);
