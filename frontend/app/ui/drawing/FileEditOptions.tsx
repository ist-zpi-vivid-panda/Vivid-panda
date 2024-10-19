'use client';

import { useCallback, useEffect, useState } from 'react';

import { FaScissors, FaPaintbrush, FaWandSparkles, FaBucket, FaSun, FaArrowRotateRight } from 'react-icons/fa6';
import { GiResize } from 'react-icons/gi';
import { IoIosColorPalette, IoIosColorFilter } from 'react-icons/io';
import { IoText } from 'react-icons/io5';
import { IconContext } from 'react-icons/lib';
import { LuEraser } from 'react-icons/lu';

import { EditingTool } from '../../lib/canvas/types';

type FileEditListOptionsProps = {
  setEditingTool?: (_: EditingTool | undefined) => void;
};

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
      <IconContext.Provider value={{ color: 'red', size: '25px' }}>
        <span style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
          Scissors
          <FaScissors />
        </span>
      </IconContext.Provider>

      <IconContext.Provider value={{ color: 'pink', size: '25px' }}>
        <span style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
          Brush
          <FaPaintbrush />
        </span>
      </IconContext.Provider>

      <IconContext.Provider value={{ color: 'orange', size: '25px' }}>
        <span style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
          Wand
          <FaWandSparkles />
        </span>
      </IconContext.Provider>

      <IconContext.Provider value={{ color: 'yellow', size: '25px' }}>
        <span style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
          Bucket
          <FaBucket />
        </span>
      </IconContext.Provider>

      <IconContext.Provider value={{ color: 'cyan', size: '25px' }}>
        <span style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
          Brightness
          <FaSun />
        </span>
      </IconContext.Provider>

      <IconContext.Provider value={{ color: 'teal', size: '25px' }}>
        <span style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
          Resize
          <GiResize />
        </span>
      </IconContext.Provider>

      <IconContext.Provider value={{ color: 'green', size: '25px' }}>
        <span style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
          Eraser
          <LuEraser />
        </span>
      </IconContext.Provider>

      <IconContext.Provider value={{ color: 'blue', size: '25px' }}>
        <span style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
          Text
          <IoText />
        </span>
      </IconContext.Provider>

      <IconContext.Provider value={{ color: 'purple', size: '25px' }}>
        <span style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
          Change color
          <IoIosColorPalette />
        </span>
      </IconContext.Provider>

      <IconContext.Provider value={{ color: 'indigo', size: '25px' }}>
        <button
          style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}
          onClick={() => toggleEditingTool(EditingTool.Rotation)}
        >
          Rotate
          <FaArrowRotateRight />
        </button>
      </IconContext.Provider>

      <IconContext.Provider value={{ color: 'black', size: '25px' }}>
        <span style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
          Add filter
          <IoIosColorFilter />
        </span>
      </IconContext.Provider>
    </div>
  );
};

export default FileEditListOptions;
