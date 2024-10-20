'use client';

import { UIEventHandler, useCallback, useMemo, useState } from 'react';

import {
  FileInfo,
  onDownloadClick,
  useDeleteFileMutation,
  useFilesData,
  usePostFileMutation,
} from '@/app/lib/api/fileApi';
import Grid from '@mui/material/Grid2';
import { useRouter } from 'next/navigation';

import FileEdit from './FileEdit';
import FilesListItem from './FilesListItem';
import ImageUpload from '../ImageUpload';
import Scrollable from '../shared/Scrollable';
import UserInfo from '../UserInfo';
import useActionPrompt from '../utilities/ActionPrompt';

const FilesList = () => {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isLoading } = useFilesData();
  const postFile = usePostFileMutation();
  const deleteFile = useDeleteFileMutation();
  const { prompt } = useActionPrompt();

  const [editedFileInfo, setEditedFileInfo] = useState<FileInfo | undefined>(undefined);

  const files = useMemo(() => (data ? data.pages.flatMap((itemsList) => itemsList.collection) : []), [data]);

  const onDeleteImage = useCallback(
    (fileInfo: FileInfo) =>
      prompt({
        title: 'Do you want to delete the image?',
        actions: [{ text: 'Delete ', onPress: () => deleteFile.mutateAsync(fileInfo.id) }],
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

  const onEditPhotoClick = useCallback((fileInfo: FileInfo) => router.push(`/canvas/edit/${fileInfo.id}`), [router]);

  return (
    <>
      <div style={{ padding: '5px 0' }}>
        <UserInfo />
      </div>

      {editedFileInfo && <FileEdit fileInfo={editedFileInfo} onClose={() => setEditedFileInfo(undefined)} />}

      <Scrollable onScroll={onScroll}>
        <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Grid size={{ xs: 3, sm: 2, md: 1 }}></Grid>
          {files.map((file, index) => (
            <Grid key={index} size={{ xs: 4, sm: 3, md: 2 }}>
              <FilesListItem
                fileInfo={file}
                onEditClick={setEditedFileInfo}
                onDeleteClick={onDeleteImage}
                onDownloadClick={onDownloadClick}
                onEditPhotoClick={onEditPhotoClick}
              />
            </Grid>
          ))}
        </Grid>
      </Scrollable>
    </>
  );
};

export default FilesList;
