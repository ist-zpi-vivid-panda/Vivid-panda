'use client';

import { useCallback } from 'react';

import { FaSave, FaDownload } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6';
import { IconContext } from 'react-icons/lib';
import { MdOutlineCleaningServices } from 'react-icons/md';

import { FileInfo, onDownloadFileInfo, useUpdateFileDataMutation } from '../lib/api/fileApi';

type ActionsMenuProps = {
  fileInfo: FileInfo | null;
  file: File | null;
};

const ActionsMenu = ({ fileInfo, file }: ActionsMenuProps) => {
  const updateFileData = useUpdateFileDataMutation();

  const handleDownload = useCallback(() => {
    if (fileInfo) {
      onDownloadFileInfo(fileInfo);
    }
  }, [fileInfo]);

  const handleFileUpdate = useCallback(() => {
    if (fileInfo && file) {
      updateFileData.mutateAsync({ id: fileInfo.id, data: file });
    }
  }, [file, fileInfo, updateFileData]);

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
        <button style={{ display: 'flex', gap: '10px', flexDirection: 'row' }} onClick={handleFileUpdate}>
          <p>Save</p>
          <FaSave />
        </button>
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
        <button style={{ display: 'flex', gap: '10px', flexDirection: 'row' }} onClick={handleDownload}>
          <p>Download</p>
          <FaDownload />
        </button>
      </IconContext.Provider>
    </div>
  );
};

export default ActionsMenu;
