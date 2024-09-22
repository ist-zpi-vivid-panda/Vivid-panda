import { Box, Grid2 as Grid } from '@mui/material';
import GridItem from '@mui/material/Grid';
import { fileEditListOptions } from './FileEditOptions';
import ImageUpload from './ImageUpload';
import Canvas from '@/app/ui/drawing/Canvas';
import { useState } from 'react';
import { convertFileToFormData, usePostFileMutation } from '../lib/api/fileApi';
import { actionsMenu } from './ActionsMenu';

const GridView = (p0: unknown) => {
    const [uploadedImage, setUploadedImage] = useState<JSX.Element | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const { mutateAsync } = usePostFileMutation();
  
    const handleImageUpload = async (image: File) => {
      try {
        const formData = convertFileToFormData(image);
        const response = await mutateAsync(formData);
        console.log('File uploaded successfully:', response);
        const imageUrl = URL.createObjectURL(image);
        setUploadedImageUrl(imageUrl);
        setUploadedImage(<img src={imageUrl} alt="Uploaded Image" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />);
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
            {actionsMenu()}
        </Grid>

        <Grid container direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ height: '100vh'}}>
            <Grid size={{ xs: 1, sm: 2, md: 2 }} sx={{ padding: 2 }}>
                {fileEditListOptions()}
            </Grid>

            <Grid size={{ xs: 12, sm: 7, md: 7}} sx={{ width: '80vw', height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '5px solid #660066', borderRadius: 4, padding: 2 }}>
            {uploadedImage ? uploadedImage : <ImageUploadComponent />}
            </Grid>

            <Grid size={{ xs: 2, sm: 3, md: 2 }} sx={{ padding: 2 }}>
                NOTHING YET
            </Grid>
        </Grid>
    </Grid>
  );
};

export default GridView;