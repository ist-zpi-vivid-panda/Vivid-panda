'use client';

import { DISPLAY_DATE_FORMAT } from '@/app/lib/dates/format';
import { FileInfo } from '@/app/lib/files/definitions';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { formatBytes } from '@/app/lib/utilities/fileSize';
import { imageStrToBase64Typed } from '@/app/lib/utilities/image';
import { Button, Card, Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import dayjs from 'dayjs';

import ResponsiveTypography from '../themed/ResponsiveTypography';

type FilesListItemProps = {
  fileInfo: FileInfo;
  onEditClick?: (_: FileInfo) => void;
  onDeleteClick?: (_: FileInfo) => void;
  onDownloadClick?: (_: FileInfo) => void;
  onEditPhotoClick?: (_: FileInfo) => void;
};

const FilesListItem = ({
  fileInfo,
  onEditClick,
  onDeleteClick,
  onDownloadClick,
  onEditPhotoClick,
}: FilesListItemProps) => {
  const { t } = useStrings(TranslationNamespace.Common);

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        p: 1,
      }}
    >
      {fileInfo.thumbnail && (
        <Avatar
          sx={{
            border: '1px solid #000',
            backgroundColor: 'primary.contrastText',
          }}
          variant="square"
          src={imageStrToBase64Typed(fileInfo.thumbnail)}
        />
      )}

      <Tooltip title={fileInfo.filename}>
        <ResponsiveTypography
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {fileInfo.filename}
        </ResponsiveTypography>
      </Tooltip>

      <ResponsiveTypography>
        {t('size')} {formatBytes(fileInfo.file_size)}
      </ResponsiveTypography>

      {fileInfo.uploaded_at && (
        <ResponsiveTypography>
          {t('uploaded_at')} {dayjs(fileInfo.uploaded_at).format(DISPLAY_DATE_FORMAT)}
        </ResponsiveTypography>
      )}

      {fileInfo.last_update_at && (
        <ResponsiveTypography>
          {t('updated_at')} {dayjs(fileInfo.last_update_at).format(DISPLAY_DATE_FORMAT)}
        </ResponsiveTypography>
      )}

      {onEditClick && (
        <Button variant="contained" onClick={() => onEditClick(fileInfo)}>
          {t('edit')}
        </Button>
      )}

      {onDeleteClick && (
        <Button variant="contained" onClick={() => onDeleteClick(fileInfo)}>
          {t('delete')}
        </Button>
      )}

      {onDownloadClick && (
        <Button variant="contained" onClick={() => onDownloadClick(fileInfo)}>
          {t('download')}
        </Button>
      )}

      {onEditPhotoClick && (
        <Button variant="contained" onClick={() => onEditPhotoClick(fileInfo)}>
          {t('files:edit_photo')}
        </Button>
      )}
    </Card>
  );
};

export default FilesListItem;
