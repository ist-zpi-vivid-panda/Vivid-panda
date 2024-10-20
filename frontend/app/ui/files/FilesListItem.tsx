'use client';

import { FileInfo } from '@/app/lib/api/fileApi';
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
  return (
    <Card className="flex flex-col p-2" style={{ backgroundColor: 'lavender' }}>
      {fileInfo.thumbnail && <Avatar variant="square" src={`data:image/jpeg;base64,${fileInfo.thumbnail}`}></Avatar>}

      <span>{fileInfo.filename}</span>

      <span>{fileInfo.file_size}</span>

      <span>{fileInfo.uploaded_at?.toDateString()}</span>

      <span>{fileInfo.last_update_at?.toDateString()}</span>

      {onEditClick && <button onClick={() => onEditClick(fileInfo)}>Edit</button>}
      {onDeleteClick && <button onClick={() => onDeleteClick(fileInfo)}>Delete</button>}
      {onDownloadClick && <button onClick={() => onDownloadClick(fileInfo)}>Download</button>}
      {onEditPhotoClick && <button onClick={() => onEditPhotoClick(fileInfo)}>Edit Photo</button>}
    </Card>
  );
};

export default FilesListItem;
