'use client';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
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
  textColor: string;
  onToolSelect: () => void;
  Icon: IconType;
};

const ActionsMenuPresentation = ({ name, color, onToolSelect, Icon }: ActionsMenuPresentationProps) => (
  <IconContext.Provider value={{ color, size: 'clamp(20px, 2vw, 35px)' }}>
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
        <span style={{ color }}>{name}</span>
        <Icon />
      </button>
    </div>
  </IconContext.Provider>
);

const ActionsMenu = ({ onSaveClick, onDeleteClick, onDownloadClick }: ActionsMenuProps) => {
  const { t } = useStrings(TranslationNamespace.Common);

  const iconColor = '#36065f';
  const textColor = '#36065f';

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
      <ActionsMenuPresentation
        name={t('save')}
        color={iconColor}
        textColor={textColor}
        Icon={() => <FaSave />}
        onToolSelect={onSaveClick}
      />

      <ActionsMenuPresentation
        name={'Cleaning'} // change to a go forwards and backwards icon button
        color={iconColor}
        textColor={textColor}
        Icon={() => <MdOutlineCleaningServices />}
        onToolSelect={() => {}}
      />

      <ActionsMenuPresentation
        name={'Revert change'}
        color={iconColor}
        textColor={textColor}
        Icon={() => <FaArrowLeft />}
        onToolSelect={() => {}}
      />

      <ActionsMenuPresentation
        name={t('delete')}
        color={iconColor}
        textColor={textColor}
        Icon={() => <FaDeleteLeft />}
        onToolSelect={onDeleteClick}
      />

      <ActionsMenuPresentation
        name={t('download')}
        color={iconColor}
        textColor={textColor}
        Icon={() => <FaDownload />}
        onToolSelect={onDownloadClick}
      />
    </div>
  );
};

export default ActionsMenu;
