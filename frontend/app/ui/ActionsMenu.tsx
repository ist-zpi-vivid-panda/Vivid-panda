'use client'

import { FaSave } from "react-icons/fa";
import { MdOutlineCleaningServices } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";
import { FaDownload } from "react-icons/fa";

export const actionsMenu = () => {
  return (
    <div style={{ fontSize: '26px', display: 'flex', gap: '10px'}}>
      <span>
        <p>Save</p><FaSave />
      </span>
      <span>
        <p>Cleaning</p><MdOutlineCleaningServices />
      </span>
      <span>
        <p>Delete</p><FaDeleteLeft />
      </span>
      <span>
        <p>Download</p><FaDownload />
      </span>
    </div>
  );
};