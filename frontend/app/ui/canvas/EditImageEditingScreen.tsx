'use client';

import { ReactNode, useState, useCallback, useEffect, useRef } from 'react';

import {
  downloadFile,
  FileInfo,
  onDownloadFileInfo,
  useDeleteFileMutation,
  useFileData,
  useUpdateFileDataMutation,
} from '@/app/lib/api/fileApi';
import { EditingTool } from '@/app/lib/canvas/definitions';
import { useRouter } from 'next/navigation';

import Canvas, { BlobConsumer } from './Canvas';
import GridView from './GridView';
import useActionPrompt from '../utilities/ActionPrompt';

type EditImageEditingScreenProps = {
  id: string;
};

const EditImageEditingScreen = ({ id }: EditImageEditingScreenProps) => {
  const blobRef = useRef<BlobConsumer | null>(null);
  const { prompt } = useActionPrompt();
  const deleteFile = useDeleteFileMutation();
  const router = useRouter();

  const [uploadedImage, setUploadedImage] = useState<string | undefined>(undefined);
  const [editingTool, setEditingTool] = useState<EditingTool | undefined>(undefined);

  const [currentEditComponent, setCurrentEditComponent] = useState<ReactNode>(false);

  const { data: fileInfo, isLoading: isLoadingFileInfo } = useFileData(id);

  const updateDataFile = useUpdateFileDataMutation();

  const handleDownload = useCallback(() => {
    if (fileInfo) {
      onDownloadFileInfo(fileInfo);
    }
  }, [fileInfo]);

  const handleSave = useCallback(() => {
    blobRef.current?.getBlob((blob) => {
      if (!blob) {
        return;
      }

      updateDataFile.mutateAsync({ id: fileInfo.id, data: new File([blob], fileInfo.filename, { type: blob.type }) });
    });
  }, [fileInfo.filename, fileInfo.id, updateDataFile]);

  useEffect(() => {
    const getFileData = async () => {
      const downloadedImageFile = await downloadFile(fileInfo.id);

      setUploadedImage(URL.createObjectURL(downloadedImageFile));
    };

    if (!isLoadingFileInfo) {
      getFileData().catch(console.trace);
    }
  }, [fileInfo.id, isLoadingFileInfo]);

  const handleDelete = useCallback(() => {
    if (fileInfo) {
      prompt({
        title: 'Do you want to delete the image?',
        actions: [
          {
            text: 'Delete',
            onPress: async () => {
              await deleteFile.mutateAsync(fileInfo.id);
              router.push('/canvas/new');
            },
          },
        ],
        cancelable: true,
      });
    }
  }, [deleteFile, fileInfo, prompt, router]);
  return (
    <>
      <GridView
        setEditingTool={setEditingTool}
        onSaveClick={handleSave}
        onDeleteClick={handleDelete}
        onDownloadClick={handleDownload}
      >
        {!!uploadedImage && (
          <Canvas
            imageStr={uploadedImage}
            editingTool={editingTool}
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
