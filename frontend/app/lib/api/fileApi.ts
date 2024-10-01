import dayjs from 'dayjs';

import { buildWholeApiUri, useDeleteMutation, useGetQuery, usePostMutation, useUpdateMutation } from './apiUtils';
import { createPaginatorFetchFn, standardPaginationEndpointGetter, usePaginator } from './pagination';
import { invalidate } from '../storage/getQueryClient';
import useUserData from '../storage/useUserData';

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
  id: string;
  filename: string;
};

const FILES_QUERY_KEY = 'files-qk' as const;

const FILES_ENDPOINT = '/files' as const;

const getFileUrl = (file: { id: string }) => FILES_ENDPOINT + file.id;

export const invalidateFiles = async (id?: string) => await invalidate(id ? [FILES_QUERY_KEY, id] : [FILES_QUERY_KEY]);

export const useFileData = (id: string) => useGetQuery<FileInfo>([FILES_QUERY_KEY, id], FILES_ENDPOINT + id);

export const useFilesData = () =>
  usePaginator({
    queryKey: [FILES_QUERY_KEY],
    queryFn: createPaginatorFetchFn<FileInfoDTO, FileInfo>(
      (pageParam) => standardPaginationEndpointGetter(FILES_ENDPOINT, pageParam),
      parseDTO
    ),
  });

export const usePostFileMutation = () => usePostMutation<File>(invalidateFiles, FILES_ENDPOINT);

export const useUpdateFileMutation = () => useUpdateMutation<FileInfoEditDTO>(invalidateFiles, getFileUrl);

export const useDeleteFileMutation = () => useDeleteMutation(invalidateFiles, getFileUrl);

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

export const useGetFile = (id: string) => {
  const userData = useUserData.getState();
  const token = userData.accessToken;
  const uri = buildWholeApiUri(`${FILES_ENDPOINT}/download/${id}`);

  const getFile = async () => {
    const response = await fetch(uri, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }

    return response.blob(); 
  };

  return { getFile };
};