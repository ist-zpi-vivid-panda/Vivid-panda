'use client';

import { ReactNode, useState, useCallback, useEffect, useRef } from 'react';

import {
  downloadFile,
  downloadFileInfo,
  useDeleteFileMutation,
  useFileData,
  useUpdateFileDataMutation,
} from '@/app/lib/api/fileApi';
import { AiFunctionType } from '@/app/lib/canvas/ai-functions/definitions';
import { EditingTool } from '@/app/lib/canvas/definitions';
import { getFileFromFileInfoAndBlob } from '@/app/lib/files/utils';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { useRouter } from 'next/navigation';

import Canvas, { BlobConsumer } from './Canvas';
import GridView from './GridView';
import useActionPrompt from '../utilities/ActionPrompt';

type EditImageEditingScreenProps = {
  id: string;
};

const EditImageEditingScreen = ({ id }: EditImageEditingScreenProps) => {
  const router = useRouter();
  const { t } = useStrings(TranslationNamespace.Canvas);

  const blobRef = useRef<BlobConsumer | null>(null);

  const [uploadedImage, setUploadedImage] = useState<string | undefined>(undefined);
  const [editingTool, setEditingTool] = useState<EditingTool | undefined>(undefined);
  const [aiFunction, setAiFunction] = useState<AiFunctionType | undefined>(undefined);

  const [currentEditComponent, setCurrentEditComponent] = useState<ReactNode>(false);

  const { data: fileInfo, isLoading: isLoadingFileInfo } = useFileData(id);

  const { prompt } = useActionPrompt();

  const updateDataFile = useUpdateFileDataMutation();
  const deleteFile = useDeleteFileMutation();

  const handleDownload = useCallback(() => {
    if (fileInfo) {
      downloadFileInfo(fileInfo);
    }
  }, [fileInfo]);

  const handleSave = useCallback(() => {
    blobRef.current?.getBlob((blob) => {
      if (!blob) {
        return;
      }

      updateDataFile.mutateAsync({ id: fileInfo.id, data: getFileFromFileInfoAndBlob(blob, fileInfo) });
    });
  }, [fileInfo, updateDataFile]);

  const handleDelete = useCallback(
    () =>
      prompt({
        title: t('files:delete_image_details'),
        actions: [
          {
            text: t('common:delete'),
            onPress: async () => {
              router.replace('/canvas/new');

              await deleteFile.mutateAsync(fileInfo.id);
            },
          },
        ],
        cancelable: true,
      }),
    [deleteFile, fileInfo.id, prompt, router, t]
  );

  useEffect(() => {
    const getFileData = async () => {
      const downloadedImageFile = await downloadFile(fileInfo.id);

      setUploadedImage(URL.createObjectURL(downloadedImageFile));
    };

    if (!isLoadingFileInfo) {
      getFileData().catch(console.trace);
    }
  }, [fileInfo.id, isLoadingFileInfo]);

  return (
    <>
      <GridView
        setEditingTool={setEditingTool}
        setAiFunction={setAiFunction}
        onSaveClick={handleSave}
        onDeleteClick={handleDelete}
        onDownloadClick={handleDownload}
      >
        {!!uploadedImage && (
          <Canvas
            imageStr={uploadedImage}
            editingTool={editingTool}
            aiFunction={aiFunction}
            setCurrentEditComponent={setCurrentEditComponent}
            ref={blobRef}
          />
        )}
      </GridView>

      {currentEditComponent}
    </>
  );
};

export default EditImageEditingScreen;
