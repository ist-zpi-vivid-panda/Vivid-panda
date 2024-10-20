'use client';

import { useCallback } from 'react';

import { FaSave, FaDownload } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6';
import { IconContext } from 'react-icons/lib';
import { MdOutlineCleaningServices } from 'react-icons/md';

import { handleDownloadFileToBrowser } from '../lib/api/fileApi';

type ActionsMenuProps = {
  idOfPhoto?: string;
  url?: string;
  filename?: string;
};

const ActionsMenu = ({ idOfPhoto, url, filename }: ActionsMenuProps) => {
  const handleDownload = useCallback(() => {
    handleDownloadFileToBrowser(idOfPhoto, url, filename);
  }, [idOfPhoto, url, filename]);

  return (
    <div
      style={{
        fontSize: '24px',
        display: 'flex',
        gap: '50px',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '25px',
      }}
    >
      <IconContext.Provider value={{ color: 'red', size: '25px' }}>
        <span style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
          <p>Save</p>
          <FaSave />
        </span>
      </IconContext.Provider>
      <IconContext.Provider value={{ color: 'yellow', size: '25px' }}>
        <span style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
          <p>Cleaning</p>
          <MdOutlineCleaningServices />
        </span>
      </IconContext.Provider>
      <IconContext.Provider value={{ color: 'green', size: '25px' }}>
        <span style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
          <p>Delete</p>
          <FaDeleteLeft />
        </span>
      </IconContext.Provider>
      <IconContext.Provider value={{ color: 'blue', size: '25px' }}>
        <span style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
          <p>Download</p>
          <FaDownload onClick={handleDownload} />
        </span>
      </IconContext.Provider>
    </div>
  );
};

export default ActionsMenu;
