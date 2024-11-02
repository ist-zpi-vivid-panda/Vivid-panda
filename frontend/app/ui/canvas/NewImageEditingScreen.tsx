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
          toast.error(error.message || 'An unexpected error occurred.');
        } else if (typeof error === 'object' && error !== null && 'response' in error) {
          const errorResponse = error as { response?: { status?: number; data?: { message?: string } } };

          if (errorResponse.response && errorResponse.response.status === 400) {
            const errorMessage = errorResponse.response.data?.message || 'An error occurred while uploading the file.';
            toast.error(errorMessage);
          } else {
            toast.error('An unexpected error occurred. Please try again later.');
          }
        } else {
          toast.error('An unexpected error occurred. Please try again later.');
        }
      }
    },
    [postFile, router]
  );

  return (
    <GridView>
      <ImageUpload onImageUpload={handleImageUpload} />
    </GridView>
  );
};

export default NewImageEditingScreen;
