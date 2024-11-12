import {
  getCall,
  SuccessStatusResponse,
  useDeleteMutation,
  useGetQuery,
  usePostMutation,
  useUpdateMutation,
} from './apiUtils';
import { createPaginatorFetchFn, standardPaginationEndpointGetter, usePaginator } from './pagination';
import { FileInfo, FileInfoDTO, FileInfoEditDTO } from '../files/definitions';
import { convertFileToFormData, parseDTO } from '../files/utils';
import { invalidate, removeQuery } from '../storage/getQueryClient';

const FILES_QUERY_KEY = 'files-qk' as const;

const FILES_ENDPOINT = '/files' as const;

const DOWNLOAD_ENDPOINT = '/download' as const;

const DATA_ENDPOINT = '/data' as const;

const getFileUrl = (id: string) => `${FILES_ENDPOINT}/${id}`;
const getFileDataUrl = (id: string) => `${FILES_ENDPOINT}${DATA_ENDPOINT}/${id}`;

export const invalidateFiles = async (id?: string) => await invalidate(id ? [FILES_QUERY_KEY, id] : [FILES_QUERY_KEY]);
export const deleteFilesQuery = async (id?: string) =>
  await removeQuery(id ? [FILES_QUERY_KEY, id] : [FILES_QUERY_KEY]);

export const useFileData = (id: string) => useGetQuery<FileInfo>([FILES_QUERY_KEY, id], getFileUrl(id));

export const useFilesData = () =>
  usePaginator({
    queryKey: [FILES_QUERY_KEY],
    queryFn: createPaginatorFetchFn<FileInfoDTO, FileInfo>(
      (pageParam) => standardPaginationEndpointGetter(FILES_ENDPOINT, pageParam),
      parseDTO
    ),
  });

export const usePostFileMutation = () =>
  usePostMutation<File, FileInfoDTO>(invalidateFiles, FILES_ENDPOINT, convertFileToFormData);

export const useUpdateFileDataMutation = () =>
  useUpdateMutation<File, SuccessStatusResponse>(invalidateFiles, getFileDataUrl, convertFileToFormData);

export const useUpdateFileMutation = () =>
  useUpdateMutation<FileInfoEditDTO, SuccessStatusResponse>(invalidateFiles, getFileUrl);

export const useDeleteFileMutation = () => useDeleteMutation(deleteFilesQuery, getFileUrl);

export const downloadFile = async (id: string) =>
  await getCall<Blob>(`${FILES_ENDPOINT}${DATA_ENDPOINT}${DOWNLOAD_ENDPOINT}/${id}`);

export const handleDownloadFileToBrowser = async (idOfPhoto: string, filename: string) => {
  if (!idOfPhoto || !filename) {
    return;
  }

  const file = await downloadFile(idOfPhoto);
  const url = URL.createObjectURL(file);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const downloadFileInfo = (fileInfo: FileInfo) => handleDownloadFileToBrowser(fileInfo.id, fileInfo.filename);
