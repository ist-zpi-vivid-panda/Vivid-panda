'use client';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { FaSave, FaDownload } from 'react-icons/fa';
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
  <IconContext.Provider value={{ color, size: '25px' }}>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <button onClick={onToolSelect} style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
        {name}
        <Icon />
      </button>
    </div>
  </IconContext.Provider>
);

const ActionsMenu = ({ onSaveClick, onDeleteClick, onDownloadClick }: ActionsMenuProps) => {
  const { t } = useStrings(TranslationNamespace.Common);

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
      }}
    >
      <ActionsMenuPresentation name={t('save')} color={iconColor} Icon={() => <FaSave />} onToolSelect={onSaveClick} />

      <ActionsMenuPresentation
        name={'Cleaning'} // change to a go forwards and backwards icon button
        color={iconColor}
        Icon={() => <MdOutlineCleaningServices />}
        onToolSelect={() => {}}
      />

      <ActionsMenuPresentation
        name={t('delete')}
        color={iconColor}
        Icon={() => <FaDeleteLeft />}
        onToolSelect={onDeleteClick}
      />

      <ActionsMenuPresentation
        name={t('download')}
        color={iconColor}
        Icon={() => <FaDownload />}
        onToolSelect={onDownloadClick}
      />
    </div>
  );
};

export default ActionsMenu;
