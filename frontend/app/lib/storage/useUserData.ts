import { clearAllQueries } from '@/app/lib/storage/getQueryClient';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type UserInfo = {
  language?: string;
  accessToken?: string;
  refreshToken?: string;
  userName?: string;
  email?: string;
  profilePicture?: string;
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
  profilePicture: undefined,
  userName: undefined,
  email: undefined,
};

const useUserData = create<UserInfoStore>()(
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
