'use client';

import { FileInfo } from '@/app/lib/api/fileApi';
import Avatar from '@mui/material/Avatar';

type FilesListItemProps = {
  fileInfo: FileInfo;
};

const FilesListItem = ({ fileInfo }: FilesListItemProps) => {
  return (
    <div className="flex flex-col">
      <span>{fileInfo._id}</span>
      <span>{fileInfo.filename}</span>
      <span>{fileInfo.file_size}</span>
      <span>{fileInfo.mime_type.toString()}</span>
      <span>{fileInfo.owner_id}</span>
      <span>{fileInfo.uploaded_at.toDateString()}</span>
      {fileInfo.thumbnail && <Avatar src={`data:image/jpeg;base64,${fileInfo.thumbnail}`}></Avatar>}
    </div>
  );
};

export default FilesListItem;
