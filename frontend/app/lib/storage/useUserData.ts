import { clearQueryCache, invalidateAllQueries } from '@/app/lib/storage/getQueryClient';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type UserInfo = {
  language?: string;
  accessToken?: string;
  refreshToken?: string;
};

export type UserInfoStore = {
  logout: () => void;
  login: (loginResult: UserInfo) => void;
} & UserInfo;

const USER_DATA_STORAGE_NAME = 'user-data-storage-vivid-panda' as const;

const EMPTY_USER_INFO: UserInfo = {
  language: undefined,
  accessToken: undefined,
  refreshToken: undefined,
};

const useUserData = create<UserInfoStore>()(
  devtools(
    persist(
      (set) => ({
        ...EMPTY_USER_INFO,
        login: (loginData: UserInfo) => {
          console.log('LOGIN');

          const result = set({ ...loginData });

          invalidateAllQueries();

          return result;
        },
        logout: () => {
          console.log('LOGOUT');

          const result = set({ ...EMPTY_USER_INFO });

          invalidateAllQueries();
          clearQueryCache();

          return result;
        },
      }),
      {
        name: USER_DATA_STORAGE_NAME,
      }
    )
  )
);

export default useUserData;
