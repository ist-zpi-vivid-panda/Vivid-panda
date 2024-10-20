'use client';

import { useEffect, useState } from 'react';

import { downloadFile, useFileData } from '@/app/lib/api/fileApi';
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
      {!!uploadedImage && <Canvas imageStr={uploadedImage} editingTool={editingTool} />}
    </GridView>
  );
};

export default EditImageEditingScreen;
