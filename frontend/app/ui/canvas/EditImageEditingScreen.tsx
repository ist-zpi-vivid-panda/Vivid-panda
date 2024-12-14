'use client';

import { ReactNode, useState, useCallback, useEffect, useRef, useMemo } from 'react';

import handleApiError from '@/app/lib/api/apiErrorHandler';
import {
  downloadFile,
  handleDownloadBlobToBrowser,
  useDeleteFileMutation,
  useFileData,
  usePostFileMutation,
  useUpdateFileDataMutation,
} from '@/app/lib/api/fileApi';
import { AiFunctionType } from '@/app/lib/canvas/ai-functions/definitions';
import { CanvasCRUDOperations, ChangeHistory, EditingTool } from '@/app/lib/canvas/definitions';
import { getFileFromFileInfoAndBlob } from '@/app/lib/files/utils';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { useRouter } from 'next/navigation';

import Canvas, { CanvasConsumer } from './Canvas';
import GridView from './GridView';
import useActionPrompt from '../utilities/ActionPrompt';

type EditImageEditingScreenProps = {
  id: string;
};

const EditImageEditingScreen = ({ id }: EditImageEditingScreenProps) => {
  const router = useRouter();
  const { t } = useStrings(TranslationNamespace.CANVAS);

  const canvasRef = useRef<CanvasConsumer | null>(null);

  const [uploadedImage, setUploadedImage] = useState<Blob | undefined>(undefined);
  const [editingTool, setEditingTool] = useState<EditingTool | undefined>(undefined);
  const [aiFunction, setAiFunction] = useState<AiFunctionType | undefined>(undefined);

  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  const [currentEditComponent, setCurrentEditComponent] = useState<ReactNode>(false);

  const { data: fileInfo, isLoading: isLoadingFileInfo } = useFileData(id);

  const { prompt } = useActionPrompt();

  const postFile = usePostFileMutation();
  const updateDataFile = useUpdateFileDataMutation();
  const deleteFile = useDeleteFileMutation();

  const handleSave = useCallback(
    () =>
      canvasRef.current?.getBlob((blob) => {
        if (!blob) {
          return;
        }

        const data = getFileFromFileInfoAndBlob(blob, fileInfo);

        updateDataFile.mutateAsync({ id: fileInfo.id, data });
      }),
    [fileInfo, updateDataFile]
  );

  const handleSaveAsNew = useCallback(
    () =>
      canvasRef.current?.getBlob((blob) => {
        if (!blob) {
          return;
        }

        const data = getFileFromFileInfoAndBlob(blob, fileInfo);

        postFile.mutateAsync(data).catch(handleApiError);
      }),
    [fileInfo, postFile]
  );

  const handleDelete = useCallback(
    () =>
      prompt({
        title: t('files:delete_image_details'),
        actions: [
          {
            text: t('common:delete'),
            onPress: () => {
              router.replace('/canvas/new');

              deleteFile.mutateAsync(fileInfo.id);
            },
          },
        ],
        cancelable: true,
      }),
    [deleteFile, fileInfo.id, prompt, router, t]
  );

  const handleDownload = useCallback(
    () =>
      canvasRef.current?.getBlob((blob) => {
        if (!blob) {
          return;
        }

        const data = getFileFromFileInfoAndBlob(blob, fileInfo);

        handleDownloadBlobToBrowser(data, fileInfo.filename);
      }),
    [fileInfo]
  );

  const canvasCrudOperations: CanvasCRUDOperations = useMemo(
    () => ({
      handleSave,
      handleSaveAsNew,
      handleDelete,
      handleDownload,
    }),
    [handleDelete, handleDownload, handleSave, handleSaveAsNew]
  );

  const changeHistoryData: ChangeHistory = useMemo(
    () => ({
      handleUndo: () => canvasRef?.current?.undo?.(),
      handleRedo: () => canvasRef?.current?.redo?.(),
      canUndo,
      canRedo,
    }),
    [canRedo, canUndo]
  );

  useEffect(() => {
    const getFileData = async () => {
      const downloadedImageFile = await downloadFile(fileInfo.id);

      setUploadedImage(downloadedImageFile);
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
        canvasCrudOperations={canvasCrudOperations}
        changeHistoryData={changeHistoryData}
        currentEditComponent={currentEditComponent}
      >
        {!!uploadedImage && (
          <Canvas
            imageBlob={uploadedImage}
            setCanUndo={setCanUndo}
            setCanRedo={setCanRedo}
            editingTool={editingTool}
            setEditingTool={setEditingTool}
            aiFunction={aiFunction}
            setAiFunction={setAiFunction}
            setCurrentEditComponent={setCurrentEditComponent}
            ref={canvasRef}
          />
        )}
      </GridView>
    </>
  );
};

export default EditImageEditingScreen;
