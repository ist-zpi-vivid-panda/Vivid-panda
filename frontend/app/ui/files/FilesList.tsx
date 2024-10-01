'use client';

import { UIEventHandler, useCallback, useMemo, useState } from 'react';

import {
  convertFileToFormData,
  FileInfo,
  useDeleteFileMutation,
  useFilesData,
  usePostFileMutation,
} from '@/app/lib/api/fileApi';
import Grid from '@mui/material/Grid2';

import FileEdit from './FileEdit';
import FilesListItem from './FilesListItem';
import ImageUpload from '../ImageUpload';
import Scrollable from '../shared/Scrollable';
import useActionPrompt from '../utilities/ActionPrompt';

const FilesList = () => {
  const { data, fetchNextPage, hasNextPage, isLoading } = useFilesData();
  const postFile = usePostFileMutation();
  const deleteFile = useDeleteFileMutation();
  const { prompt } = useActionPrompt();

  const [editedFileInfo, setEditedFileInfo] = useState<FileInfo | undefined>(undefined);

  const files = useMemo(() => (data ? data.pages.flatMap((itemsList) => itemsList.collection) : []), [data]);

  const onImageUpload = useCallback((image: File) => postFile.mutateAsync(image), [postFile]);
  const onDeleteImage = useCallback(
    (fileInfo: FileInfo) =>
      prompt({
        title: 'Do you want to delete the image?',
        actions: [{ text: 'Delete', onPress: () => deleteFile.mutateAsync(fileInfo.id) }],
        cancelable: true,
      }),
    [deleteFile, prompt]
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
              <FilesListItem fileInfo={file} onEditClick={setEditedFileInfo} onDeleteClick={onDeleteImage} />
            </Grid>
          ))}
        </Grid>
      </Scrollable>
    </>
  );
};

export default FilesList;
