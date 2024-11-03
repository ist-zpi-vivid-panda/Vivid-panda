'use client';

import { ChangeEvent, useRef, useState, DragEvent } from 'react';

import PressableSpan from '@/app/ui/shared/PressableSpan';

type ImageUploadProps = {
  onImageUpload: (image: File) => void;
};

const ACCEPTED_EXTENSIONS = '.jpg, .jpeg, .png' as const;
// const MAX_SIZE = 16 * 1024 * 1024; // 16MB

const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      onImageUpload(file);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setDragActive(false);

    const file = e.target.files?.[0];

    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div
      className="flex flex-1 justify-center border-2 border-dashed border-black rounded-xl overflow-hidden"
      style={{ display: 'flex', width: '100%', height: '100%' }}
    >
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
            max={1}
            min={1}
            onChange={handleImageUpload}
            ref={inputRef}
          />

          <p
            className={`${dragActive ? 'primaryBackgroundActive' : 'primaryBackground'} p-24 rounded-xl border-0`}
            style={{ fontSize: 'clamp(10px, 1.5vw, 20px)' }}
          >
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
