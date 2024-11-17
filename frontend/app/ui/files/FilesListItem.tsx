'use client';

import { FileInfo } from '@/app/lib/files/definitions';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { Card } from '@mui/material';
import Avatar from '@mui/material/Avatar';

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
    <Card className="flex flex-col p-2" style={{ backgroundColor: 'lavender' }}>
      {fileInfo.thumbnail && <Avatar variant="square" src={`data:image/jpeg;base64,${fileInfo.thumbnail}`}></Avatar>}

      <span>{fileInfo.filename}</span>

      <span>{fileInfo.file_size}</span>

      <span>{fileInfo.uploaded_at?.toDateString()}</span>

      <span>{fileInfo.last_update_at?.toDateString()}</span>

      {onEditClick && <button onClick={() => onEditClick(fileInfo)}>{t('edit')}</button>}
      {onDeleteClick && <button onClick={() => onDeleteClick(fileInfo)}>{t('delete')}</button>}
      {onDownloadClick && <button onClick={() => onDownloadClick(fileInfo)}>{t('download')}</button>}
      {onEditPhotoClick && <button onClick={() => onEditPhotoClick(fileInfo)}>{t('files:edit_photo')}</button>}
    </Card>
  );
};

export default FilesListItem;
