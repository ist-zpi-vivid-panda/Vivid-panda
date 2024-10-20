import { QueryFunction, useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { getCall } from './apiUtils';

export type Pagination = {
  page: number;
  per_page: number;
};

export type PaginationResult<T> = {
  collection: T[];
  total_pages: number;
  total_items: number;
} & Pagination;

type PaginatorProps<T> = {
  queryKey: string[];
  queryFn: QueryFunction<PaginationResult<T>, string[], Pagination>;
};

type PaginatorFetchProps = {
  pageParam: Pagination;
};

const INITAL_PAGE_FOR_PAGINATION = 1 as const;
const PER_PAGE_PAGINATION = 20 as const;

const INITIAL_PAGINATION: Pagination = {
  page: INITAL_PAGE_FOR_PAGINATION,
  per_page: PER_PAGE_PAGINATION,
};

const EMPTY_PAGINATION_RES: PaginationResult<unknown> = {
  collection: [],
  total_pages: 1,
  total_items: 0,
  page: 1,
  per_page: PER_PAGE_PAGINATION,
};

export const usePaginator = <T,>({ queryKey, queryFn }: PaginatorProps<T>) =>
  useSuspenseInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam: INITIAL_PAGINATION,
    getNextPageParam: (pagination) =>
      pagination.page < pagination.total_pages ? { ...pagination, page: pagination.page + 1 } : undefined,
  });

export const createPaginatorFetchFn =
  <DTO, VAL>(getEndpoint: (pageParam: Pagination) => string, parseFromDTO: (_: DTO) => VAL) =>
  async ({ pageParam }: PaginatorFetchProps) => {
    const response = await getCall<PaginationResult<DTO>>(getEndpoint(pageParam));

    const hasError = 'error' in response;

    if (hasError) {
      return EMPTY_PAGINATION_RES as PaginationResult<VAL>;
    }

    return {
      ...response,
      collection: response.collection.map((res) => parseFromDTO(res)),
    } as PaginationResult<VAL>;
  };

export const standardPaginationEndpointGetter = (endpoint: string, pageParam: Pagination) =>
  `${endpoint}?page=${pageParam.page}&per_page=${pageParam.per_page}`;
