// not tested!

import { MIMEType } from 'util';

import { invalidate, useDeleteMutation, useGetQuery, usePostMutation, useUpdateMutation } from './apiUtils';
import { createPaginatorFetchFn, standardPaginationEndpointGetter, usePaginator } from './pagination';

type FileInfo = {
  file_id: string;
  filename: string;
  mime_type: MIMEType;
  file_size: number;
  uploaded_at: Date;
  owner_id: string;
};

const FILES_QUERY_KEY = 'files-qk' as const;

const FILES_ENDPOINT = '/files/' as const;

const getFileUrl = (file: FileInfo) => FILES_ENDPOINT + file.file_id;

export const invalidateFiles = async (id?: string) => await invalidate(id ? [FILES_QUERY_KEY, id] : [FILES_QUERY_KEY]);

export const useFileData = (id: string) => useGetQuery<FileInfo>([FILES_QUERY_KEY, id], FILES_ENDPOINT + id);

export const useFilesData = () =>
  usePaginator({
    queryKey: [FILES_QUERY_KEY],
    queryFn: createPaginatorFetchFn((pageParam) => standardPaginationEndpointGetter(FILES_ENDPOINT, pageParam)),
  });

export const usePostFileMutation = () => usePostMutation(invalidateFiles, FILES_ENDPOINT);

export const useUpdateFileMutation = () => useUpdateMutation(invalidateFiles, getFileUrl);

export const useDeleteFileMutation = () => useDeleteMutation(invalidateFiles, getFileUrl);
