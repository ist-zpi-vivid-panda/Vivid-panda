import { Grid2 as Grid } from '@mui/material';
import GridItem from '@mui/material/Grid';
import { fileEditListOptions } from './FileEditOptions';
import ImageUpload from './ImageUpload';
import Canvas from '@/app/ui/drawing/Canvas';
import { useState } from 'react';

const GridView = (p0: unknown) => {
  const [uploadedImage, setUploadedImage] = useState<JSX.Element | null>(null);

  const handleImageUpload = (image: File) => {
    const imageStr = URL.createObjectURL(image);
    setUploadedImage(<Canvas imageStr={imageStr} gridSize={{width: 600, height: 600}} />);
  };

  return (
    <Grid container direction="column">
        <Grid size={{ xs: 8, sm: 8, md: 8 }} justifyContent="center" alignItems="center">
            NOTHING YET
        </Grid>

        <Grid container direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>

            <Grid size={{ xs: 1, sm: 2, md: 2 }}>
                {fileEditListOptions()}
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6}} sx={{ width: '80vw', height: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {uploadedImage ? uploadedImage : <ImageUpload onImageUpload={handleImageUpload} />}
            </Grid>

            <Grid size={{ xs: 2, sm: 3, md: 2 }}>
                NOTHING YET
            </Grid>
            
        </Grid>
    </Grid>
  );
};

export default GridView;