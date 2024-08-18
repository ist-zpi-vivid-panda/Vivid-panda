'use client';

import { useState } from 'react';

import Canvas from '@/app/ui/drawing/Canvas';
import ImageUpload from '@/app/ui/ImageUpload';

const ImageEditingScreen = () => {
  const [imageStr, setImageStr] = useState<string | null>();

  const onImageUpload = (image: string) => setImageStr(image);

  return !imageStr ? <ImageUpload onImageUpload={onImageUpload} /> : <Canvas imageStr={imageStr!} />;
};

export default ImageEditingScreen;
