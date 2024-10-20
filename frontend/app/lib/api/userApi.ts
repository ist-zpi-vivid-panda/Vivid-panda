import { useGetQuery } from './apiUtils';

type UserInfo = {
  id: string;
  email: string;
  username?: string;
  provider: string;
};

type ProfilePicture = {
  data: string;
};

const USER_QUERY_KEY = 'user-qk' as const;
const USER_INFO_QUERY_KEY = 'info-qk' as const;
const USER_PROFILE_PICTURE_QUERY_KEY = 'profile-picture-qk' as const;

const USER_ENDPOINT = '/users' as const;
const USER_PROFILE_PICTURE_ENDPOINT = '/profile-picture' as const;

export const useUserInfo = () => useGetQuery<UserInfo>([USER_QUERY_KEY, USER_INFO_QUERY_KEY], USER_ENDPOINT);

export const useUserProfilePicture = () =>
  useGetQuery<ProfilePicture>(
    [USER_QUERY_KEY, USER_PROFILE_PICTURE_QUERY_KEY],
    USER_ENDPOINT + USER_PROFILE_PICTURE_ENDPOINT
  );
