'use client';

import { Dispatch, SetStateAction, useCallback } from 'react';

import { AiFunctionType } from '@/app/lib/canvas/ai-functions/definitions';
import { Box } from '@mui/material';
import { FaScissors, FaWandSparkles, FaArrowRotateRight, FaEraser } from 'react-icons/fa6';
import { GiResize } from 'react-icons/gi';
import { IoIosColorFilter, IoIosMove } from 'react-icons/io';
import { IconContext } from 'react-icons/lib';

import { EditingTool } from '../../lib/canvas/definitions';

type FileEditListOptionsProps = {
  setEditingTool?: Dispatch<SetStateAction<EditingTool | undefined>>;
  setAiFunction?: Dispatch<SetStateAction<AiFunctionType | undefined>>;
};

type EditToolPresentationProps = {
  name: string;
  color: string;
  onToolSelect: () => void;
  Icon: React.ElementType;
};

const EditingToolPresentation = ({ name, color, onToolSelect, Icon }: EditToolPresentationProps) => (
  <IconContext.Provider value={{ color, size: 'clamp(20px, 2vw, 35px)' }}>
    {' '}
    {/* Responsive icon size */}
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <button
        onClick={onToolSelect}
        style={{
          display: 'flex',
          gap: '10px',
          flexDirection: 'row',
          fontSize: 'clamp(16px, 1.5vw, 40px)',
        }}
      >
        {name}
        <Icon />
      </button>
    </div>
  </IconContext.Provider>
);

const FileEditListOptions = ({ setEditingTool, setAiFunction }: FileEditListOptionsProps) => {
  const iconColor = '#006444';

  const toggleEditingTool = useCallback(
    (editingTool: EditingTool) => setEditingTool?.((prev) => (editingTool === prev ? undefined : editingTool)),
    [setEditingTool]
  );

  const toggleAiFunction = useCallback(
    (aiFunc: AiFunctionType) => setAiFunction?.((prev) => (aiFunc === prev ? undefined : aiFunc)),
    [setAiFunction]
  );

  // maybe change names to icons with tooltips
  return (
    <Box
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <EditingToolPresentation
        name={'Scissors'}
        color={iconColor}
        Icon={FaScissors}
        onToolSelect={() => toggleEditingTool(EditingTool.Crop)}
      />

      <EditingToolPresentation
        name={'Move'}
        color={iconColor}
        Icon={IoIosMove}
        onToolSelect={() => toggleEditingTool(EditingTool.Move)}
      />

      <EditingToolPresentation
        name={'Resize'}
        color={iconColor}
        Icon={GiResize}
        onToolSelect={() => toggleEditingTool(EditingTool.Zoom)}
      />

      <EditingToolPresentation
        name={'Filter'}
        color={iconColor}
        Icon={IoIosColorFilter}
        onToolSelect={() => toggleEditingTool(EditingTool.Filter)}
      />

      <EditingToolPresentation
        name={'Rotate'}
        color={iconColor}
        Icon={FaArrowRotateRight}
        onToolSelect={() => toggleEditingTool(EditingTool.Rotation)}
      />

      <EditingToolPresentation
        name={'Add object'}
        color={iconColor}
        Icon={FaWandSparkles}
        onToolSelect={() => toggleAiFunction(AiFunctionType.AddObject)}
      />

      <EditingToolPresentation
        name={'Delete object'}
        color={iconColor}
        Icon={FaEraser}
        onToolSelect={() => toggleAiFunction(AiFunctionType.DeleteObject)}
      />
    </Box>
  );
};

export default FileEditListOptions;
