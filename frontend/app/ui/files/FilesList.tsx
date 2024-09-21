'use client';

import { UIEventHandler, useCallback, useMemo, useState } from 'react';

import { convertFileToFormData, FileInfo, useFilesData, usePostFileMutation } from '@/app/lib/api/fileApi';
import Grid from '@mui/material/Grid2';

import FileEdit from './FileEdit';
import FilesListItem from './FilesListItem';
import ImageUpload from '../ImageUpload';
import Scrollable from '../shared/Scrollable';

const FilesList = () => {
  const { data, fetchNextPage, hasNextPage, isLoading } = useFilesData();
  const postFile = usePostFileMutation();

  const [editedFileInfo, setEditedFileInfo] = useState<FileInfo | undefined>(undefined);

  const files = useMemo(() => (data ? data.pages.flatMap((itemsList) => itemsList.collection) : []), [data]);

  const onImageUpload = useCallback(
    async (image: File) => {
      const formData = convertFileToFormData(image);

      await postFile.mutateAsync(formData);
    },
    [postFile]
  );

  const onScroll: UIEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

      if (scrollHeight - scrollTop === clientHeight && !isLoading && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isLoading]
  );

  return (
    <>
      <FileEdit fileInfo={editedFileInfo} onClose={() => setEditedFileInfo(undefined)} />

      <ImageUpload onImageUpload={onImageUpload} />

      <Scrollable onScroll={onScroll}>
        <Grid container spacing={2}>
          {files.map((file, index) => (
            <Grid key={index} size={{ xs: 4, sm: 3, md: 2 }}>
              <FilesListItem fileInfo={file} onEditClick={setEditedFileInfo} />
            </Grid>
          ))}
        </Grid>
      </Scrollable>
    </>
  );
};

export default FilesList;
