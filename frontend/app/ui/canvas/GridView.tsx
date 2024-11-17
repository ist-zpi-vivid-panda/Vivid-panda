'use client';

import { Dispatch, SetStateAction } from 'react';

import { AiFunctionType } from '@/app/lib/canvas/ai-functions/definitions';
import { EditingTool } from '@/app/lib/canvas/definitions';
import { Children } from '@/app/lib/definitions';
import { Grid2 as Grid } from '@mui/material';

import ActionsMenu from './ActionsMenu';
import FileEditListOptions from './FileEditOptions';

type GridViewProps = {
  setEditingTool?: Dispatch<SetStateAction<EditingTool | undefined>>;
  setAiFunction?: Dispatch<SetStateAction<AiFunctionType | undefined>>;
  onSaveClick: () => void;
  onDeleteClick: () => void;
  onDownloadClick: () => void;
  children?: Children;
};

const GridView = ({
  setEditingTool,
  setAiFunction,
  onSaveClick,
  onDeleteClick,
  onDownloadClick,
  children,
}: GridViewProps) => {
  return (
    <Grid container direction="column">
      <Grid
        size={{ xs: 1, sm: 1, md: 12 }}
        sx={{
          padding: 0.1, // Reduced padding to minimize space
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <ActionsMenu onSaveClick={onSaveClick} onDeleteClick={onDeleteClick} onDownloadClick={onDownloadClick} />
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start" // Align content to the top
        sx={{
          height: '100vh',
        }}
      >
        <Grid
          size={{ xs: 1, sm: 2, md: 3 }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FileEditListOptions setEditingTool={setEditingTool} setAiFunction={setAiFunction} />
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

        <Grid size={{ xs: 2, sm: 3, md: 2 }} sx={{ padding: 2 }}></Grid>
      </Grid>
    </Grid>
  );
};

export default GridView;
