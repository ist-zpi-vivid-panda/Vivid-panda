'use client';

import { CanvasCRUDOperations, ChangeHistory } from '@/app/lib/canvas/definitions';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import LibraryAddRoundedIcon from '@mui/icons-material/LibraryAddRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { Button, Tooltip, Card } from '@mui/material';

type ActionsMenuProps = {
  canvasCrudOperations: CanvasCRUDOperations;
  changeHistoryData: ChangeHistory;
};

type ActionsMenuPresentationProps = {
  name: string;
  onToolSelect: () => void;
  Icon: React.ElementType;
  disabled?: boolean;
};

const ActionsMenuPresentation = ({ name, onToolSelect, Icon }: ActionsMenuPresentationProps) => (
  <Tooltip title={name}>
    <Button
      variant="contained"
      onClick={onToolSelect}
      sx={{
        gap: '10px',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'flex-center',
      }}
    >
      <Icon />
    </Button>
  </Tooltip>
);

const ActionsMenu = ({ canvasCrudOperations, changeHistoryData }: ActionsMenuProps) => {
  const { t } = useStrings(TranslationNamespace.COMMON);

  return (
    <Card
      sx={{
        fontSize: '24px',
        display: 'flex',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '25px',
        flexDirection: 'row',
        padding: 2,
      }}
    >
      <ActionsMenuPresentation name={t('save')} Icon={SaveRoundedIcon} onToolSelect={canvasCrudOperations.handleSave} />

      <ActionsMenuPresentation
        name={t('save_as_copy')}
        Icon={LibraryAddRoundedIcon}
        onToolSelect={canvasCrudOperations.handleSaveAsNew}
      />

      <ActionsMenuPresentation
        name={t('undo')}
        Icon={ArrowBackRoundedIcon}
        onToolSelect={changeHistoryData.handleUndo}
        disabled={!changeHistoryData.canUndo}
      />

      <ActionsMenuPresentation
        name={t('redo')}
        Icon={ArrowForwardRoundedIcon}
        onToolSelect={changeHistoryData.handleRedo}
        disabled={!changeHistoryData.canRedo}
      />

      <ActionsMenuPresentation
        name={t('delete')}
        Icon={DeleteForeverRoundedIcon}
        onToolSelect={canvasCrudOperations.handleDelete}
      />

      <ActionsMenuPresentation
        name={t('download')}
        Icon={DownloadRoundedIcon}
        onToolSelect={canvasCrudOperations.handleDownload}
      />
    </Card>
  );
};

export default ActionsMenu;
