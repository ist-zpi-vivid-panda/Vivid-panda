'use client';

import { EditingTool } from '@/app/lib/canvas/definitions';
import { ChildrenProp } from '@/app/lib/definitions';
import { Grid2 as Grid } from '@mui/material';

import ActionsMenu from '../ActionsMenu';
import FileEditListOptions from './FileEditOptions';

type GridViewProps = ChildrenProp & {
  setEditingTool?: (_: EditingTool | undefined) => void;
  onSaveClick: () => void;
  onDeleteClick: () => void;
  onDownloadClick: () => void;
};

const GridView = ({ setEditingTool, onSaveClick, onDeleteClick, onDownloadClick, children }: GridViewProps) => {
  return (
    <Grid container direction="column">
      <Grid size={{ xs: 1, sm: 1, md: 12 }} sx={{ padding: 1, display: 'flex', justifyContent: 'center' }}>
        <ActionsMenu onSaveClick={onSaveClick} onDeleteClick={onDeleteClick} onDownloadClick={onDownloadClick} />
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
          <FileEditListOptions setEditingTool={setEditingTool} />
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
