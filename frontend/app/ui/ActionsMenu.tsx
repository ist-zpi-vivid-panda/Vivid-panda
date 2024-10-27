'use client';

import { useCallback } from 'react';

import { FaSave, FaDownload } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6';
import { IconContext, IconType } from 'react-icons/lib';
import { MdOutlineCleaningServices } from 'react-icons/md';

import { FileInfo, onDownloadFileInfo, useUpdateFileDataMutation } from '../lib/api/fileApi';

type ActionsMenuProps = {
  fileInfo: FileInfo | null;
  file: File | null;
};

type ActionsMenuPresentationProps = {
  name: string;
  color: string;
  onToolSelect: () => void;
  Icon: IconType;
};

const ActionsMenuPresentation = ({ name, color, onToolSelect, Icon }: ActionsMenuPresentationProps) => (
  <IconContext.Provider value={{ color, size: '25px' }}>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <button onClick={onToolSelect} style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
        {name}
        <Icon />
      </button>
    </div>
  </IconContext.Provider>
);

const ActionsMenu = ({ fileInfo, file }: ActionsMenuProps) => {
  const updateFileData = useUpdateFileDataMutation();
  const iconColor = '#006444';

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
        gap: '25px',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '25px',
      }}
    >
      <ActionsMenuPresentation
        name={'Save'}
        color={iconColor}
        Icon={() => <FaSave />}
        onToolSelect={handleFileUpdate}
      />

      <ActionsMenuPresentation
        name={'Cleaning'}
        color={iconColor}
        Icon={() => <MdOutlineCleaningServices />}
        onToolSelect={() => {}}
      />

      <ActionsMenuPresentation
        name={'Delete'}
        color={iconColor}
        Icon={() => <FaDeleteLeft />}
        onToolSelect={handleFileUpdate}
      />

      <ActionsMenuPresentation
        name={'Download'}
        color={iconColor}
        Icon={() => <FaDownload />}
        onToolSelect={handleDownload}
      />
    </div>
  );
};

export default ActionsMenu;
