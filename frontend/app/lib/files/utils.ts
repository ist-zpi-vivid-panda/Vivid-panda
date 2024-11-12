import dayjs from 'dayjs';

import { FileInfo, FileInfoDTO } from './definitions';

export const getFileFromBlob = (blob: Blob, filename: string) => new File([blob], filename, { type: blob.type });

export const getFileFromFileInfoAndBlob = (blob: Blob, fileInfo: FileInfo) => getFileFromBlob(blob, fileInfo.filename);

export const convertFileToFormData = (image: File) => {
  const formData = new FormData();

  formData.append('file', image);

  return formData;
};

export const parseDTO = (dto: FileInfoDTO): FileInfo => ({
  ...dto,
  last_update_at: dayjs(dto.last_update_at).toDate(),
  uploaded_at: dayjs(dto.uploaded_at).toDate(),
});
