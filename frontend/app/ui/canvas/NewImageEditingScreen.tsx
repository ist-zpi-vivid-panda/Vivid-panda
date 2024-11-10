'use client';

import { useCallback } from 'react';

import { usePostFileMutation } from '@/app/lib/api/fileApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import GridView from './GridView';
import ImageUpload from '../ImageUpload';

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
    <GridView onSaveClick={() => {}} onDeleteClick={() => {}} onDownloadClick={() => {}}>
      <ImageUpload onImageUpload={handleImageUpload} />
    </GridView>
  );
};

export default NewImageEditingScreen;
