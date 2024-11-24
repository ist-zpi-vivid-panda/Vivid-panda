// this is used because there is a bug in js that makes the images a lot bigger if other type/no typ is used
// it can make an image from 2.3MB to 20MB
export const DEFAULT_IMAGE_TYPE: string = 'image/jpeg' as const;

export const convertImageDataToImageStr = (imageData: ImageData) => {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  ctx?.putImageData(imageData, 0, 0);

  return canvas.toDataURL(DEFAULT_IMAGE_TYPE);
};

export const imageStrToBase64Typed = (imageStr: string) => `data:${DEFAULT_IMAGE_TYPE};base64,${imageStr}`;
