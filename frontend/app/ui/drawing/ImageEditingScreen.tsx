'use client';

import { useCallback, useState } from 'react';

import Canvas from '@/app/ui/drawing/Canvas';
import ImageUpload from '@/app/ui/ImageUpload';

const ImageEditingScreen = () => {
  const [imageStr, setImageStr] = useState<string | null>();

  // a function as using useMemo yields an error due to:
  // https://stackoverflow.com/questions/74962589/referenceerror-filereader-is-not-defined-in-next-js
  const configuredFileReader = useCallback(() => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.result) {
        const result = reader.result as string;
        setImageStr(result);
      }
    };

    return reader;
  }, [setImageStr]);

  const onImageUpload = useCallback(
    (image: File) => {
      configuredFileReader().readAsDataURL(image);
    },
    [configuredFileReader]
  );

  return !imageStr ? <ImageUpload onImageUpload={onImageUpload} /> : <Canvas imageStr={imageStr!} />;
};

export default ImageEditingScreen;
