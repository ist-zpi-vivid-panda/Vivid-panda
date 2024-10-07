'use client';

import { useState, useEffect, useCallback } from 'react';

import { FaSave, FaDownload } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6';
import { MdOutlineCleaningServices } from 'react-icons/md';

import { downloadFile, useGetFile } from '../lib/api/fileApi';

type ActionsMenuProps = {
  idOfPhoto?: string;
};

const ActionsMenu = ({ idOfPhoto }: ActionsMenuProps) => {
  const handleDownload = useCallback(() => {
    if (idOfPhoto) {
      downloadFile(idOfPhoto);
    }
  }, [idOfPhoto]);

  return (
    <div style={{ fontSize: '26px', display: 'flex', gap: '10px' }}>
      <span>
        <p>Save</p>
        <FaSave />
      </span>
      <span>
        <p>Cleaning</p>
        <MdOutlineCleaningServices />
      </span>
      <span>
        <p>Delete</p>
        <FaDeleteLeft />
      </span>
      <span>
        <p>Download</p>
        <FaDownload onClick={handleDownload} />
      </span>
    </div>
  );
};

export default ActionsMenu;
