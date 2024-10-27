'use client';

import { useCallback, useEffect, useState } from 'react';

import { downloadFile, useFileData, useUpdateFileDataMutation } from '@/app/lib/api/fileApi';
import { EditingTool } from '@/app/lib/canvas/types';

import Canvas from './Canvas';
import GridView from './GridView';

type EditImageEditingScreenProps = {
  id: string;
};

const EditImageEditingScreen = ({ id }: EditImageEditingScreenProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | undefined>(undefined);
  const [editingTool, setEditingTool] = useState<EditingTool | undefined>(undefined);

  const { data: fileInfo, isLoading: isLoadingFileInfo } = useFileData(id);
  const updateDataFile = useUpdateFileDataMutation();

  const getBlobFromCnvas = useCallback(
    (canvas: HTMLCanvasElement | undefined) =>
      canvas?.toBlob((blob) => {
        if (!blob) {
          return;
        }

        updateDataFile.mutateAsync({ id: fileInfo.id, data: new File([blob], fileInfo.filename, { type: blob.type }) });
      }),
    [fileInfo.filename, fileInfo.id, updateDataFile]
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
    <GridView fileInfo={fileInfo} setEditingTool={setEditingTool}>
      {!!uploadedImage && <Canvas imageStr={uploadedImage} editingTool={editingTool} getCanvas={getBlobFromCnvas} />}
    </GridView>
  );
};

export default EditImageEditingScreen;
