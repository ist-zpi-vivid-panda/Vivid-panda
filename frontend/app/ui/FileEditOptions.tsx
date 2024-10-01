'use client';

import { FaScissors, FaPaintbrush, FaWandSparkles, FaBucket, FaSun, FaArrowRotateRight } from 'react-icons/fa6';
import { GiResize } from 'react-icons/gi';
import { IoIosColorPalette, IoIosColorFilter } from 'react-icons/io';
import { IoText } from 'react-icons/io5';
import { LuEraser } from 'react-icons/lu';

const FileEditListOptions = () => {
  return (
    <div style={{ fontSize: '20px', gap: '10px' }}>
      <p>Scissors</p>
      <FaScissors />
      <p>Brush</p>
      <FaPaintbrush />
      <p>Wand</p>
      <FaWandSparkles />
      <p>Bucket</p>
      <FaBucket />
      <p>Change brightness</p>
      <FaSun />
      <p>Resize</p>
      <GiResize />
      <p>Eraser</p>
      <LuEraser />
      <p>Text</p>
      <IoText />
      <p>Change color</p>
      <IoIosColorPalette />
      <p>Rotate</p>
      <FaArrowRotateRight />
      <p>Add filter</p>
      <IoIosColorFilter />
    </div>
  );
};

export default FileEditListOptions;
