'use client';

import { useEffect, useState } from 'react';

import { ChildrenProp } from '@/app/lib/definitions';
import { Grid2 as Grid } from '@mui/material';

import { FileInfo } from '../../lib/api/fileApi';
import ActionsMenu from '../ActionsMenu';
import FileEditListOptions from '../FileEditOptions';

/*
// a function as using useMemo yields an error due to:
  // https://stackoverflow.com/questions/74962589/referenceerror-filereader-is-not-defined-in-next-js
  const configuredFileReader = useCallback(() => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.result) {
        const result = reader.result as string;
        setImageStr(result);
      }
    };

    return reader;
  }, [setImageStr]);

  const onImageUpload = useCallback(
    (image: File) => {
      configuredFileReader().readAsDataURL(image);
    },
    [configuredFileReader]
  );
*/

type GridViewProps = ChildrenProp & {
  fileStr?: string;
  fileInfo?: FileInfo;
};

const GridView = ({ fileStr, fileInfo: fileInfoFromParent, children }: GridViewProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | undefined>(fileStr);
  const [fileInfo, setFileInfo] = useState<FileInfo | undefined>(fileInfoFromParent);

  useEffect(() => {
    if (fileStr) {
      setUploadedImage(fileStr);
    }
  }, [fileStr]);

  useEffect(() => {
    if (fileInfoFromParent) {
      setFileInfo(fileInfoFromParent);
    }
  }, [fileInfoFromParent]);

  return (
    <Grid container direction="column">
      <Grid size={{ xs: 1, sm: 1, md: 12 }} sx={{ padding: 1, display: 'flex', justifyContent: 'center' }}>
        <ActionsMenu idOfPhoto={fileInfo?.id} url={uploadedImage} filename={fileInfo?.filename} />
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{
          height: '100vh',
        }}
      >
        <Grid
          size={{ xs: 1, sm: 2, md: 2 }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FileEditListOptions />
        </Grid>

        <Grid
          size={{ xs: 12, sm: 7, md: 7 }}
          sx={{
            height: '80%',
            justifyContent: 'center',
            alignItems: 'center',
            border: '3px dashed #660066',
          }}
        >
          {children}
        </Grid>

        <Grid size={{ xs: 2, sm: 3, md: 2 }} sx={{ padding: 2 }}>
          Hi, I am your AI assistant
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GridView;
