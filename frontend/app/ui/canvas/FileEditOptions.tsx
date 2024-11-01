'use client';

import { useCallback, useEffect, useState } from 'react';

import { FaScissors, FaWandSparkles, FaBucket, FaSun, FaArrowRotateRight } from 'react-icons/fa6';
import { GiResize } from 'react-icons/gi';
import { IoIosColorFilter, IoIosMove } from 'react-icons/io';
import { IoText } from 'react-icons/io5';
import { IconContext, IconType } from 'react-icons/lib';
import { LuEraser } from 'react-icons/lu';

import { EditingTool } from '../../lib/canvas/types';

type FileEditListOptionsProps = {
  setEditingTool?: (_: EditingTool | undefined) => void;
};

type EditToolPresentationProps = {
  name: string;
  color: string;
  onToolSelect: () => void;
  Icon: IconType;
};
const EditingToolPresentation = ({ name, color, onToolSelect, Icon }: EditToolPresentationProps) => (
  <IconContext.Provider value={{ color, size: '25px' }}>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <button
        onClick={onToolSelect}
        style={{ display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'center' }}
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
      setCurrentEditingTool((prevTool) => {
        if (editingTool === prevTool) {
          return;
        }

        return editingTool;
      }),
    []
  );

  useEffect(() => {
    setEditingTool?.(currentEditingTool);
  }, [currentEditingTool, setEditingTool]);

  return (
    <div
      style={{
        padding: 10,
        fontSize: '24px',
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <EditingToolPresentation
        name={'Scissors'}
        color={iconColor}
        Icon={() => <FaScissors />}
        onToolSelect={() => toggleEditingTool(EditingTool.Crop)}
      />

      <EditingToolPresentation
        name={'Wand'}
        color={iconColor}
        Icon={() => <FaWandSparkles />}
        onToolSelect={() => {}}
      />

      <EditingToolPresentation name={'Bucket'} color={iconColor} Icon={() => <FaBucket />} onToolSelect={() => {}} />

      <EditingToolPresentation name={'Brightness'} color={iconColor} Icon={() => <FaSun />} onToolSelect={() => {}} />

      <EditingToolPresentation
        name={'Move'}
        color={'cyan'}
        Icon={() => <IoIosMove />}
        onToolSelect={() => toggleEditingTool(EditingTool.Move)}
      />

      <EditingToolPresentation
        name={'Resize'}
        color={iconColor}
        Icon={() => <GiResize />}
        onToolSelect={() => toggleEditingTool(EditingTool.Zoom)}
      />

      <EditingToolPresentation name={'Eraser'} color={iconColor} Icon={() => <LuEraser />} onToolSelect={() => {}} />

      <EditingToolPresentation name={'Text'} color={iconColor} Icon={() => <IoText />} onToolSelect={() => {}} />

      <EditingToolPresentation
        name={'Filter'}
        color={iconColor}
        Icon={() => <IoIosColorFilter />}
        onToolSelect={() => toggleEditingTool(EditingTool.Filter)}
      />

      <EditingToolPresentation
        name={'Rotate'}
        color={iconColor}
        Icon={() => <FaArrowRotateRight />}
        onToolSelect={() => toggleEditingTool(EditingTool.Rotation)}
      />
    </div>
  );
};

export default FileEditListOptions;
