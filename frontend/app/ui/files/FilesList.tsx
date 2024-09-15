'use client';

import { useCallback, useMemo } from 'react';

import { convertFileToFormData, useFilesData, usePostFileMutation } from '@/app/lib/api/fileApi';
import Grid from '@mui/material/Grid2';

import FilesListItem from './FilesListItem';
import ImageUpload from '../ImageUpload';

const FilesList = () => {
  const { data, fetchNextPage } = useFilesData();
  const postFile = usePostFileMutation();

  const files = useMemo(() => (data ? data.pages.flatMap((itemsList) => itemsList.collection) : []), [data]);

  const onImageUpload = useCallback(
    async (image: File) => {
      const formData = convertFileToFormData(image);

      await postFile.mutateAsync(formData);
    },
    [postFile]
  );

  return (
    <>
      <ImageUpload onImageUpload={onImageUpload} />

      <Grid container spacing={3}>
        {files.map((file, index) => (
          <Grid key={index} size="grow">
            <FilesListItem fileInfo={file} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default FilesList;
