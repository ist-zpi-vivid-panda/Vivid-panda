'use client';

import { useCallback } from 'react';

import { usePostFileMutation } from '@/app/lib/api/fileApi';
import { CanvasCRUDOperations, ChangeHistory } from '@/app/lib/canvas/definitions';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import GridView from './GridView';
import ImageUpload from './ImageUpload';

const VOID_FN = () => {};

const canvasCrudOperations: CanvasCRUDOperations = Object.freeze({
  handleSave: VOID_FN,
  handleSaveAsNew: VOID_FN,
  handleDelete: VOID_FN,
  handleDownload: VOID_FN,
} as const);

const changeHistoryData: ChangeHistory = Object.freeze({
  handleUndo: VOID_FN,
  handleRedo: VOID_FN,
  canUndo: false,
  canRedo: false,
} as const);

const MAX_IMAGE_SIZE = 16;
const MAX_IMAGE_MULT = MAX_IMAGE_SIZE * 1024 * 1024; // 16 MB

const NewImageEditingScreen = () => {
  const router = useRouter();
  const postFile = usePostFileMutation();
  const { t } = useStrings(TranslationNamespace.Canvas);

  const handleImageUpload = useCallback(
    async (image: File) => {
      if (image.size >= MAX_IMAGE_MULT) {
        toast.error(t('max_image_size', { size: MAX_IMAGE_SIZE }));
        return;
      }

      try {
        const response = await postFile.mutateAsync(image);
        router.replace(`/canvas/edit/${response.id}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    },
    [postFile, router, t]
  );

  return (
    <GridView
      canvasCrudOperations={canvasCrudOperations}
      changeHistoryData={changeHistoryData}
      currentEditComponent={false}
    >
      <ImageUpload onImageUpload={handleImageUpload} />
    </GridView>
  );
};

export default NewImageEditingScreen;
