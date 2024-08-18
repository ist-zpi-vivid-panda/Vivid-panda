import { clearAllQueries } from '@/storage/queryClientConfig';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type UserInfo = {
  userId?: string;
  userName?: string;
  email?: string;
  language?: string;
  authToken?: string;
  profilePicture?: string;
};

const USER_DATA_STORAGE_NAME = 'user-data-storage-vivid-panda';

const EMPTY_USER_INFO: UserInfo = {
  userId: undefined,
  email: undefined,
  language: undefined,
  userName: undefined,
  profilePicture: undefined,
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
