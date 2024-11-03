'use client';

import React from 'react';

import { FaSave, FaDownload, FaArrowLeft } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6';
import { IconContext, IconType } from 'react-icons/lib';
import { MdOutlineCleaningServices } from 'react-icons/md';

type ActionsMenuProps = {
  onSaveClick: () => void;
  onDeleteClick: () => void;
  onDownloadClick: () => void;
};

type ActionsMenuPresentationProps = {
  name: string;
  color: string;
  onToolSelect: () => void;
  Icon: IconType;
};

const ActionsMenuPresentation = ({ name, color, onToolSelect, Icon }: ActionsMenuPresentationProps) => (
  <IconContext.Provider value={{ color, size: 'clamp(20px, 2vw, 35px)' }}>
    {' '}
    {/* Responsive icon size */}
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <button
        onClick={onToolSelect}
        style={{
          display: 'flex',
          gap: '10px',
          flexDirection: 'row',
          fontSize: 'clamp(16px, 1.5vw, 40px)',
        }}
      >
        {name}
        <Icon />
      </button>
    </div>
  </IconContext.Provider>
);

const ActionsMenu = ({ onSaveClick, onDeleteClick, onDownloadClick }: ActionsMenuProps) => {
  const iconColor = '#006444';

  return (
    <div
      style={{
        fontSize: '24px',
        display: 'flex',
        gap: '25px',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '25px',
        flexDirection: 'column',
      }}
    >
      <ActionsMenuPresentation name={'Save'} color={iconColor} Icon={() => <FaSave />} onToolSelect={onSaveClick} />

      <ActionsMenuPresentation
        name={'Cleaning'}
        color={iconColor}
        Icon={() => <MdOutlineCleaningServices />}
        onToolSelect={() => {}}
      />

      <ActionsMenuPresentation
        name={'Revert change'}
        color={iconColor}
        Icon={() => <FaArrowLeft />}
        onToolSelect={() => {}}
      />

      <ActionsMenuPresentation
        name={'Delete'}
        color={iconColor}
        Icon={() => <FaDeleteLeft />}
        onToolSelect={onDeleteClick}
      />

      <ActionsMenuPresentation
        name={'Download'}
        color={iconColor}
        Icon={() => <FaDownload />}
        onToolSelect={onDownloadClick}
      />
    </div>
  );
};

export default ActionsMenu;
