export type FileInfoDTO = {
  id: string;
  filename: string;
  mime_type: string;
  file_size: number;
  uploaded_at: string;
  last_update_at: string;
  owner_id: string;
  thumbnail?: string;
};

export type FileInfo = {
  id: string;
  filename: string;
  mime_type: string;
  file_size: number;
  uploaded_at: Date;
  last_update_at: Date;
  owner_id: string;
  thumbnail?: string;
};

export type FileInfoEditDTO = {
  filename: string;
};
