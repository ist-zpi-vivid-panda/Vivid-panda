'use client';

import { CanvasCRUDOperations, ChangeHistory } from '@/app/lib/canvas/definitions';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { FaSave, FaDownload, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6';
import { IconContext, IconType } from 'react-icons/lib';
import { MdOutlineCleaningServices } from 'react-icons/md';

type ActionsMenuProps = {
  canvasCrudOperations: CanvasCRUDOperations;
  changeHistoryData: ChangeHistory;
};

type ActionsMenuPresentationProps = {
  name: string;
  color: string;
  textColor: string;
  onToolSelect: () => void;
  Icon: IconType;
  disabled?: boolean;
};

const ActionsMenuPresentation = ({ name, color, onToolSelect, Icon, disabled }: ActionsMenuPresentationProps) => (
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
        disabled={disabled}
      >
        <span style={{ color }}>{name}</span>
        <Icon />
      </button>
    </div>
  </IconContext.Provider>
);

const ActionsMenu = ({ canvasCrudOperations, changeHistoryData }: ActionsMenuProps) => {
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
        flexDirection: 'row',
      }}
    >
      <ActionsMenuPresentation
        name={t('save')}
        color={iconColor}
        textColor={textColor}
        Icon={() => <FaSave />}
        onToolSelect={canvasCrudOperations.handleSave}
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
        onToolSelect={() => changeHistoryData.handleUndo}
        disabled={!changeHistoryData.canUndo}
      />

      <ActionsMenuPresentation
        name={'Revert change'}
        color={iconColor}
        textColor={textColor}
        Icon={() => <FaArrowRight />}
        onToolSelect={() => changeHistoryData.handleRedo}
        disabled={!changeHistoryData.canRedo}
      />

      <ActionsMenuPresentation
        name={t('delete')}
        color={iconColor}
        textColor={textColor}
        Icon={() => <FaDeleteLeft />}
        onToolSelect={canvasCrudOperations.handleDelete}
      />

      <ActionsMenuPresentation
        name={t('download')}
        color={iconColor}
        textColor={textColor}
        Icon={() => <FaDownload />}
        onToolSelect={canvasCrudOperations.handleDownload}
      />
    </div>
  );
};

export default ActionsMenu;
