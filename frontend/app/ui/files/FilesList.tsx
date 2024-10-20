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
import InfiniteScroll from 'react-infinite-scroll-component';

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

  const onEditPhotoClick = useCallback((fileInfo: FileInfo) => router.push(`/canvas/edit/${fileInfo.id}`), [router]);

  return (
    <>
      <div style={{ padding: '5px 0' }}>
        <UserInfo />
      </div>

      {editedFileInfo && <FileEdit fileInfo={editedFileInfo} onClose={() => setEditedFileInfo(undefined)} />}

      <InfiniteScroll
        dataLength={files.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <Grid container spacing={3}>
          {files.map((file) => (
            <Grid key={file.id} size={{ xs: 5, sm: 4, md: 3, lg: 2 }}>
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
      </InfiniteScroll>
    </>
  );
};

export default FilesList;
