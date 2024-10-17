'use client';

import { useEffect, useState } from 'react';

import { downloadFile, useFileData } from '@/app/lib/api/fileApi';

import Canvas from './Canvas';
import GridView from './GridView';

type EditImageEditingScreenProps = {
  id: string;
};

const EditImageEditingScreen = ({ id }: EditImageEditingScreenProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | undefined>(undefined);

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
    <GridView fileStr={uploadedImage} fileInfo={fileInfo}>
      {!!uploadedImage && <Canvas imageStr={uploadedImage} />}
    </GridView>
  );
};

export default EditImageEditingScreen;
