'use client';

import { useCallback } from 'react';

import { usePostFileMutation } from '@/app/lib/api/fileApi';
import { CanvasCRUDOperations, ChangeHistory } from '@/app/lib/canvas/definitions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import GridView from './GridView';
import ImageUpload from '../ImageUpload';

const VOID_FN = () => {};

const canvasCrudOperations: CanvasCRUDOperations = Object.freeze({
  handleSave: VOID_FN,
  handleDelete: VOID_FN,
  handleDownload: VOID_FN,
} as const);

const changeHistoryData: ChangeHistory = Object.freeze({
  handleUndo: VOID_FN,
  handleRedo: VOID_FN,
  canUndo: false,
  canRedo: false,
} as const);

const NewImageEditingScreen = () => {
  const router = useRouter();
  const postFile = usePostFileMutation();

  const handleImageUpload = useCallback(
    async (image: File) => {
      try {
        const response = await postFile.mutateAsync(image);
        router.replace(`/canvas/edit/${response.id}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    },
    [postFile, router]
  );

  return (
    <GridView canvasCrudOperations={canvasCrudOperations} changeHistoryData={changeHistoryData}>
      <ImageUpload onImageUpload={handleImageUpload} />
    </GridView>
  );
};

export default NewImageEditingScreen;
