'use client';

import { useCallback, useEffect, useState } from 'react';

import { FaScissors, FaPaintbrush, FaWandSparkles, FaBucket, FaSun, FaArrowRotateRight } from 'react-icons/fa6';
import { GiResize } from 'react-icons/gi';
import { IoIosColorPalette, IoIosColorFilter, IoIosMove } from 'react-icons/io';
import { IoText } from 'react-icons/io5';
import { IconBaseProps, IconContext, IconType } from 'react-icons/lib';
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
    <button onClick={onToolSelect} style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
      {name}
    </button>

    <Icon />
  </IconContext.Provider>
);

const FileEditListOptions = ({ setEditingTool }: FileEditListOptionsProps) => {
  const [currentEditingTool, setCurrentEditingTool] = useState<EditingTool | undefined>(undefined);

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
        color={'red'}
        Icon={() => <FaPaintbrush />}
        onToolSelect={() => toggleEditingTool(EditingTool.Crop)}
      />

      <EditingToolPresentation name={'Wand'} color={'orange'} Icon={() => <FaWandSparkles />} onToolSelect={() => {}} />

      <EditingToolPresentation name={'Bucket'} color={'yellow'} Icon={() => <FaBucket />} onToolSelect={() => {}} />

      <EditingToolPresentation name={'Brightness'} color={'cyan'} Icon={() => <FaSun />} onToolSelect={() => {}} />

      <EditingToolPresentation
        name={'Move'}
        color={'cyan'}
        Icon={() => <IoIosMove />}
        onToolSelect={() => toggleEditingTool(EditingTool.Move)}
      />

      <EditingToolPresentation
        name={'Resize'}
        color={'teal'}
        Icon={() => <GiResize />}
        onToolSelect={() => toggleEditingTool(EditingTool.Zoom)}
      />

      <EditingToolPresentation name={'Eraser'} color={'green'} Icon={() => <LuEraser />} onToolSelect={() => {}} />

      <EditingToolPresentation name={'Text'} color={'blue'} Icon={() => <IoText />} onToolSelect={() => {}} />

      <EditingToolPresentation
        name={'Filter'}
        color={'purple'}
        Icon={() => <IoIosColorFilter />}
        onToolSelect={() => {}}
      />

      <EditingToolPresentation
        name={'Rotate'}
        color={'indigo'}
        Icon={() => <FaArrowRotateRight />}
        onToolSelect={() => toggleEditingTool(EditingTool.Rotation)}
      />
    </div>
  );
};

export default FileEditListOptions;
