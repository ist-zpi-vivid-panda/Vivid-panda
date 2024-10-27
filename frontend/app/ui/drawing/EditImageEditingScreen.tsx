'use client';

import { ReactNode, useEffect, useState } from 'react';

import { downloadFile, useFileData } from '@/app/lib/api/fileApi';
import { EditingTool } from '@/app/lib/canvas/types';

import Canvas from './Canvas';
import GridView from './GridView';

type EditImageEditingScreenProps = {
  id: string;
};

const DEFAULT_EDIT_COMPONENT: ReactNode = <div></div>;

const EditImageEditingScreen = ({ id }: EditImageEditingScreenProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | undefined>(undefined);
  const [editingTool, setEditingTool] = useState<EditingTool | undefined>(undefined);

  const [currentEditComponent, setCurrentEditComponent] = useState<ReactNode>(DEFAULT_EDIT_COMPONENT);

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
    <>
      <GridView fileInfo={fileInfo} setEditingTool={setEditingTool}>
        {!!uploadedImage && (
          <Canvas
            imageStr={uploadedImage}
            editingTool={editingTool}
            setCurrentEditComponent={setCurrentEditComponent}
          />
        )}
      </GridView>

      {currentEditComponent}
    </>
  );
};

export default EditImageEditingScreen;
