'use client';

import { useState, useEffect } from 'react';

import { FaSave, FaDownload } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6';
import { MdOutlineCleaningServices } from 'react-icons/md';

import { useGetFile } from '../lib/api/fileApi';

const ActionsMenu = () => {
  const { getFile } = useGetFile('66efe7f76c7aeffedcbbfffd');
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      const blob = await getFile();
      setFileBlob(blob);
    };
    fetchFile();
  }, [getFile]);

  const handleDownload = async () => {
    if (!fileBlob) return;
    try {
      const fileUrl = URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = 'file-name.jpg';
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

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