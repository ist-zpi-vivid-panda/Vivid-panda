'use client';

import { Dispatch, SetStateAction, useCallback } from 'react';

import { AiFunctionType } from '@/app/lib/canvas/ai-functions/definitions';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import ContentCutRoundedIcon from '@mui/icons-material/ContentCutRounded';
import FilterHdrRoundedIcon from '@mui/icons-material/FilterHdrRounded';
import FormatPaintRoundedIcon from '@mui/icons-material/FormatPaintRounded';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import OpenWithRoundedIcon from '@mui/icons-material/OpenWithRounded';
import RotateRightRoundedIcon from '@mui/icons-material/RotateRightRounded';
import ZoomOutMapRoundedIcon from '@mui/icons-material/ZoomOutMapRounded';
import { Button } from '@mui/material';

import { EditingTool } from '../../lib/canvas/definitions';
import ResponsiveTypography from '../themed/ResponsiveTypography';
import TrayCard from '../themed/TrayCard';

type FileEditListOptionsProps = {
  setEditingTool?: Dispatch<SetStateAction<EditingTool | undefined>>;
  setAiFunction?: Dispatch<SetStateAction<AiFunctionType | undefined>>;
};

type EditToolPresentationProps = {
  name: string;
  onToolSelect: () => void;
  Icon: React.ElementType;
};

const EditingToolPresentation = ({ name, onToolSelect, Icon }: EditToolPresentationProps) => (
  <Button
    variant="contained"
    onClick={onToolSelect}
    sx={{
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'flex-start',
      gap: 2,
    }}
  >
    <Icon />

    <ResponsiveTypography>{name}</ResponsiveTypography>
  </Button>
);

const FileEditListOptions = ({ setEditingTool, setAiFunction }: FileEditListOptionsProps) => {
  const { t } = useStrings(TranslationNamespace.CANVAS);

  const toggleEditingTool = useCallback(
    (editingTool: EditingTool) => setEditingTool?.((prev) => (editingTool === prev ? undefined : editingTool)),
    [setEditingTool]
  );

  const toggleAiFunction = useCallback(
    (aiFunc: AiFunctionType) => setAiFunction?.((prev) => (aiFunc === prev ? undefined : aiFunc)),
    [setAiFunction]
  );

  return (
    <TrayCard>
      <EditingToolPresentation
        name={t('scissors')}
        Icon={ContentCutRoundedIcon}
        onToolSelect={() => toggleEditingTool(EditingTool.Crop)}
      />

      <EditingToolPresentation
        name={t('move')}
        Icon={OpenWithRoundedIcon}
        onToolSelect={() => toggleEditingTool(EditingTool.Move)}
      />

      <EditingToolPresentation
        name={t('resize')}
        Icon={ZoomOutMapRoundedIcon}
        onToolSelect={() => toggleEditingTool(EditingTool.Zoom)}
      />

      <EditingToolPresentation
        name={t('filter')}
        Icon={FilterHdrRoundedIcon}
        onToolSelect={() => toggleEditingTool(EditingTool.Filter)}
      />

      <EditingToolPresentation
        name={t('rotate')}
        Icon={RotateRightRoundedIcon}
        onToolSelect={() => toggleEditingTool(EditingTool.Rotation)}
      />

      <EditingToolPresentation
        name={t('add_object')}
        Icon={AutoAwesomeRoundedIcon}
        onToolSelect={() => toggleAiFunction(AiFunctionType.AddObject)}
      />

      <EditingToolPresentation
        name={t('delete_object')}
        Icon={AutoFixHighRoundedIcon}
        onToolSelect={() => toggleAiFunction(AiFunctionType.DeleteObject)}
      />

      <EditingToolPresentation
        name={t('upscalling')}
        Icon={KeyboardDoubleArrowUpRoundedIcon}
        onToolSelect={() => toggleAiFunction(AiFunctionType.Upscale)}
      />

      <EditingToolPresentation
        name={t('style_transfer')}
        Icon={FormatPaintRoundedIcon}
        onToolSelect={() => toggleAiFunction(AiFunctionType.TransferStyle)}
      />

      <EditingToolPresentation
        name={t('colorize_image')}
        Icon={ColorLensRoundedIcon}
        onToolSelect={() => toggleAiFunction(AiFunctionType.ColorizeImage)}
      />
    </TrayCard>
  );
};

export default FileEditListOptions;
