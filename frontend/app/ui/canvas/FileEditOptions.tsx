'use client';

import { Dispatch, SetStateAction, useCallback } from 'react';

import { AiFunctionType } from '@/app/lib/canvas/ai-functions/definitions';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { Box } from '@mui/material';
import { CgStyle } from 'react-icons/cg';
import { FaScissors, FaWandSparkles, FaArrowRotateRight, FaEraser, FaAnglesUp } from 'react-icons/fa6';
import { GiResize } from 'react-icons/gi';
import { IoIosColorFilter, IoIosMove, IoMdColorPalette } from 'react-icons/io';
import { IconContext } from 'react-icons/lib';

import { EditingTool } from '../../lib/canvas/definitions';

type FileEditListOptionsProps = {
  setEditingTool?: Dispatch<SetStateAction<EditingTool | undefined>>;
  setAiFunction?: Dispatch<SetStateAction<AiFunctionType | undefined>>;
};

type EditToolPresentationProps = {
  name: string;
  color: string;
  textColor: string;
  onToolSelect: () => void;
  Icon: React.ElementType;
};

const EditingToolPresentation = ({ name, color, onToolSelect, Icon }: EditToolPresentationProps) => (
  <IconContext.Provider value={{ color, size: 'clamp(20px, 2vw, 35px)' }}>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <button
        onClick={onToolSelect}
        style={{
          display: 'flex',
          gap: '3px',
          flexDirection: 'row',
          fontSize: 'clamp(16px, 1.5vw, 40px)',
          alignItems: 'center',
          border: '2px solid #660066',
        }}
      >
        <Icon />
        <span style={{ color }}>{name}</span>
        
      </button>
    </div>
  </IconContext.Provider>
);

const FileEditListOptions = ({ setEditingTool, setAiFunction }: FileEditListOptionsProps) => {
  const iconColor = '#36065f';
  const textColor = '#36065f';

  const { t } = useStrings(TranslationNamespace.Canvas);

  const toggleEditingTool = useCallback(
    (editingTool: EditingTool) => setEditingTool?.((prev) => (editingTool === prev ? undefined : editingTool)),
    [setEditingTool]
  );

  const toggleAiFunction = useCallback(
    (aiFunc: AiFunctionType) => setAiFunction?.((prev) => (aiFunc === prev ? undefined : aiFunc)),
    [setAiFunction]
  );

  return (
    <Box
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <EditingToolPresentation
        name={t('scissors')}
        color={iconColor}
        textColor={textColor}
        Icon={FaScissors}
        onToolSelect={() => toggleEditingTool(EditingTool.Crop)}
      />

      <EditingToolPresentation
        name={t('move')}
        color={iconColor}
        textColor={textColor}
        Icon={IoIosMove}
        onToolSelect={() => toggleEditingTool(EditingTool.Move)}
      />

      <EditingToolPresentation
        name={t('resize')}
        color={iconColor}
        textColor={textColor}
        Icon={GiResize}
        onToolSelect={() => toggleEditingTool(EditingTool.Zoom)}
      />

      <EditingToolPresentation
        name={t('filter')}
        color={iconColor}
        textColor={textColor}
        Icon={IoIosColorFilter}
        onToolSelect={() => toggleEditingTool(EditingTool.Filter)}
      />

      <EditingToolPresentation
        name={t('rotate')}
        color={iconColor}
        textColor={textColor}
        Icon={FaArrowRotateRight}
        onToolSelect={() => toggleEditingTool(EditingTool.Rotation)}
      />

      <EditingToolPresentation
        name={t('add_object')}
        color={iconColor}
        textColor={textColor}
        Icon={FaWandSparkles}
        onToolSelect={() => toggleAiFunction(AiFunctionType.AddObject)}
      />

      <EditingToolPresentation
        name={t('delete_object')}
        color={iconColor}
        textColor={textColor}
        Icon={FaEraser}
        onToolSelect={() => toggleAiFunction(AiFunctionType.DeleteObject)}
      />

      <EditingToolPresentation
        name={t('upscalling')}
        color={iconColor}
        textColor={textColor}
        Icon={FaAnglesUp}
        onToolSelect={() => toggleAiFunction(AiFunctionType.Upscale)}
      />

      <EditingToolPresentation
        name={t('style_transfer')}
        color={iconColor}
        textColor={textColor}
        Icon={CgStyle}
        onToolSelect={() => toggleAiFunction(AiFunctionType.TransferStyle)}
      />

      <EditingToolPresentation
        name={t('colorize_image')}
        color={iconColor}
        textColor={textColor}
        Icon={IoMdColorPalette}
        onToolSelect={() => toggleAiFunction(AiFunctionType.ColorizeImage)}
      />
    </Box>
  );
};

export default FileEditListOptions;
