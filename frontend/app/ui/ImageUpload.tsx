'use client';

import { ChangeEvent, useCallback, useRef, useState, DragEvent } from 'react';

import PressableSpan from '@/app/ui/shared/PressableSpan';

type ImageUploadProps = {
  onImageUpload: (image: string) => void;
};

const ACCEPTED_EXTENSIONS = '.jpg, .jpeg, .png';

const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // a function as using useMemo yields an error due to:
  // https://stackoverflow.com/questions/74962589/referenceerror-filereader-is-not-defined-in-next-js
  const configuredFileReader = useCallback(() => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.result) {
        const result = reader.result as string;
        onImageUpload(result);
      }
    };

    return reader;
  }, [onImageUpload]);

  const handleDragEvent = (newDragActive: boolean) => (e: DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(newDragActive);
  };

  const openFileExplorer = () => {
    inputRef.current!.value = '';
    inputRef.current!.click();
  };

  const handleDrop = (e: DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      configuredFileReader().readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setDragActive(false);

    const file = e.target.files?.[0];

    if (file) {
      configuredFileReader().readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-1 m-10 justify-center border-2 border-dashed border-black rounded-xl overflow-hidden">
      <form
        className="flex flex-1 justify-center items-center"
        onDragEnter={handleDragEvent(true)}
        onSubmit={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragLeave={handleDragEvent(false)}
        onDragOver={handleDragEvent(true)}
      >
        {/* get rid of weird behaviour when hovering child elements (mostly their borders)*/}
        <div className="pointer-events-none">
          <input
            className="hidden"
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            multiple={false}
            onChange={handleImageUpload}
            ref={inputRef}
          />

          <p className={`${dragActive ? 'primaryBackgroundActive' : 'primaryBackground'} p-24 rounded-xl border-0`}>
            Drag & Drop files or{' '}
            <PressableSpan onClick={openFileExplorer}>
              <u>Select files</u>
            </PressableSpan>{' '}
            to upload
          </p>
        </div>
      </form>
    </div>
  );
};

export default ImageUpload;
