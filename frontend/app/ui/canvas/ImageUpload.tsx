'use client';

import { ChangeEvent, useRef, useState, DragEvent } from 'react';

import PressableSpan from '@/app/ui/shared/PressableSpan';
import { Box, Card } from '@mui/material';

import { TranslationNamespace } from '../../lib/internationalization/definitions';
import useStrings from '../../lib/internationalization/useStrings';
import ResponsiveTypography from '../themed/ResponsiveTypography';

type ImageUploadProps = {
  onImageUpload: (image: File) => void;
};

const ACCEPTED_EXTENSIONS = '.jpg, .jpeg, .png' as const;

const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
  const { t } = useStrings(TranslationNamespace.FILES);

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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        border: '2px dashed',
        borderRadius: '16px',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        borderColor: 'primary.main',
      }}
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

          <Card
            sx={{
              p: 10,
              backgroundColor: dragActive ? 'primary.main' : 'background.paper',
            }}
          >
            <ResponsiveTypography>
              {`${t('drag_and_drop_or')} `}
              <PressableSpan onClick={openFileExplorer}>
                <u>{t('select_file')}</u>
              </PressableSpan>
              {`, ${t('to_upload')}`}
            </ResponsiveTypography>
          </Card>
        </div>
      </form>
    </Box>
  );
};

export default ImageUpload;
