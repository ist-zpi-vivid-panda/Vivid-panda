import { apiCall, POST } from '@/app/lib/api/apiUtils';
import useUserData, { UserInfo } from '@/app/lib/storage/useUserData';

export type LoginProps = {
  email: string;
  password: string;
};

export type RegisterProps = {
  email: string;
  password: string;
  username?: string;
};

export const loginUser = async (loginProps: LoginProps) => {
  const apiResult = await apiCall(POST, '/auth/login', loginProps);

  if (!apiResult || !apiResult.access_token || !apiResult.refresh_token) {
    return;
  }

  const loginData: UserInfo = {
    accessToken: apiResult.access_token,
    refreshToken: apiResult.refresh_token,
  };

  return loginData;
};

export const registerUser = async (registerProps: RegisterProps) => {
  const apiResult = await apiCall(POST, '/auth/register', registerProps);

  if (!apiResult || !apiResult.accessToken || !apiResult.refreshToken) {
    return false;
  }

  const loginData: UserInfo = {
    accessToken: apiResult.accessToken,
    refreshToken: apiResult.refreshToken,
  };

  return loginData;
};