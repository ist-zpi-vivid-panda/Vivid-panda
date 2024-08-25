import { clearAllQueries } from '@/app/lib/storage/getQueryClient';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type UserInfo = {
  language?: string;
  accessToken?: string;
  refreshToken?: string;
};

const USER_DATA_STORAGE_NAME = 'user-data-storage-vivid-panda';

const EMPTY_USER_INFO: UserInfo = {
  language: undefined,
  accessToken: undefined,
  refreshToken: undefined,
};

const useUserData = create<UserInfo>()(
  devtools(
    persist(
      (set) => ({
        ...EMPTY_USER_INFO,
        login: (loginData: UserInfo) => {
          console.log('LOGIN');
          return set({ ...loginData });
        },
        logout: () => {
          console.log('LOGOUT');

          clearAllQueries();

          return set({ ...EMPTY_USER_INFO });
        },
      }),
      {
        name: USER_DATA_STORAGE_NAME,
      }
    )
  )
);

export default useUserData;
