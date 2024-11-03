'use client';

import { useCallback, useEffect, useState } from 'react';

import { Box } from '@mui/material'; // Import MUI's Box component
import { FaScissors, FaWandSparkles, FaBucket, FaSun, FaArrowRotateRight } from 'react-icons/fa6';
import { GiResize } from 'react-icons/gi';
import { IoIosColorFilter, IoIosMove } from 'react-icons/io';
import { IoText } from 'react-icons/io5';
import { IconContext } from 'react-icons/lib';
import { LuEraser } from 'react-icons/lu';

import { EditingTool } from '../../lib/canvas/definitions';

type FileEditListOptionsProps = {
  setEditingTool?: (_: EditingTool | undefined) => void;
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

const FileEditListOptions = ({ setEditingTool }: FileEditListOptionsProps) => {
  const [currentEditingTool, setCurrentEditingTool] = useState<EditingTool | undefined>(undefined);
  const iconColor = '#006444';

  const toggleEditingTool = useCallback(
    (editingTool: EditingTool) =>
      setCurrentEditingTool((prevTool) => (editingTool === prevTool ? undefined : editingTool)),
    []
  );

  useEffect(() => {
    setEditingTool?.(currentEditingTool);
  }, [currentEditingTool, setEditingTool]);

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

      <EditingToolPresentation name={'Wand'} color={iconColor} Icon={FaWandSparkles} onToolSelect={() => {}} />

      <EditingToolPresentation name={'Bucket'} color={iconColor} Icon={FaBucket} onToolSelect={() => {}} />

      <EditingToolPresentation name={'Brightness'} color={iconColor} Icon={FaSun} onToolSelect={() => {}} />

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

      <EditingToolPresentation name={'Eraser'} color={iconColor} Icon={LuEraser} onToolSelect={() => {}} />

      <EditingToolPresentation name={'Text'} color={iconColor} Icon={IoText} onToolSelect={() => {}} />

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
    </Box>
  );
};

export default FileEditListOptions;
