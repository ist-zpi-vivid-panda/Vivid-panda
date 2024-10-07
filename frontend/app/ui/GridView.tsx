import { useState } from 'react';

import { Grid2 as Grid } from '@mui/material';
import Image from 'next/image';

import ActionsMenu from './ActionsMenu';
import FileEditListOptions from './FileEditOptions';
import ImageUpload from './ImageUpload';
import { downloadFile, FileDownloadDTO, FileInfoDTO, usePostFileMutation } from '../lib/api/fileApi';

const GridView = () => {
  const [uploadedImage, setUploadedImage] = useState<string | undefined>(undefined);
  const [fileInfo, setFileInfo] = useState<FileInfoDTO | null>(null);
  const [imageFile, setImageFile] = useState<Blob | null>(null);

  const { mutateAsync } = usePostFileMutation();

  const handleImageUpload = async (image: File) => {
    try {
      const response = await mutateAsync(image);
      setFileInfo(response);
      console.log('File uploaded successfully:', response);
      const downloadedImageFile = await downloadFile(response.id);
      setImageFile(downloadedImageFile);
      setUploadedImage(URL.createObjectURL(downloadedImageFile));
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const ImageUploadComponent = () => {
    return <ImageUpload onImageUpload={handleImageUpload} />;
  };

  return (
    <Grid container direction="column">
      <Grid size={{ xs: 1, sm: 1, md: 12 }} sx={{ padding: 1, display: 'flex', justifyContent: 'center' }}>
        <ActionsMenu idOfPhoto={fileInfo?.id} url={uploadedImage} filename={fileInfo?.filename} />
      </Grid>

      <Grid container direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <Grid size={{ xs: 1, sm: 2, md: 2 }} sx={{ padding: 2 }}>
          <FileEditListOptions />
        </Grid>

        <Grid
          size={{ xs: 12, sm: 7, md: 7 }}
          sx={{
            width: '80vw',
            height: '80%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '5px solid #660066',
            borderRadius: 4,
            padding: 2,
          }}
        >
          {uploadedImage ? (
            <img
              src={uploadedImage}
              alt="Uploaded Image"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <ImageUploadComponent />
          )}
        </Grid>

        <Grid size={{ xs: 2, sm: 3, md: 2 }} sx={{ padding: 2 }}>
          NOTHING YET
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GridView;
