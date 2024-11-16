'use client';

import { useCallback, useMemo, useState } from 'react';

import { downloadFileInfo, useDeleteFileMutation, useFilesData } from '@/app/lib/api/fileApi';
import { FileInfo } from '@/app/lib/files/definitions';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import Grid from '@mui/material/Grid2';
import { useRouter } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';

import FileEdit from './FileEdit';
import FilesListItem from './FilesListItem';
import UserInfo from '../UserInfo';
import useActionPrompt from '../utilities/ActionPrompt';

const FilesList = () => {
  const router = useRouter();

  const { t } = useStrings(TranslationNamespace.Files);

  const deleteFile = useDeleteFileMutation();

  const { data, fetchNextPage, hasNextPage } = useFilesData();
  const { prompt } = useActionPrompt();

  const [editedFileInfo, setEditedFileInfo] = useState<FileInfo | undefined>(undefined);

  const files = useMemo(() => (data ? data.pages.flatMap((itemsList) => itemsList.collection) : []), [data]);

  const onDeleteImage = useCallback(
    (fileInfo: FileInfo) =>
      prompt({
        title: t('delete_image_details'),
        actions: [{ text: t('common:delete'), onPress: () => deleteFile.mutateAsync(fileInfo.id) }],
        cancelable: true,
      }),
    [deleteFile, prompt, t]
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
        loader={<h4>{t('common:loading')}</h4>}
        endMessage={
          <p style={{ textAlign: 'center', color: 'black' }}>
            <b>{t('common:all_loaded')}</b>
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
                onDownloadClick={downloadFileInfo}
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
