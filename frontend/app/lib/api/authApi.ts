import { apiCall, ApiResponse, POST } from '@/app/lib/api/apiUtils';
import { UserInfo } from '@/app/lib/storage/useUserData';

export type LoginProps = {
  email: string;
  password: string;
};

export type RegisterProps = {
  email: string;
  password: string;
  username?: string;
};

export type AuthResult = {
  access_token: string;
  refresh_token: string;
};

const auth = (apiResult: ApiResponse<AuthResult>) => {
  if (!apiResult || 'error' in apiResult || !apiResult.access_token || !apiResult.refresh_token) {
    return;
  }

  return {
    accessToken: apiResult.access_token,
    refreshToken: apiResult.refresh_token,
  } as UserInfo;
};

export const loginUser = async (loginProps: LoginProps) => {
  const apiResult = await apiCall<AuthResult>(POST, '/auth/login', loginProps);

  return auth(apiResult);
};

export const registerUser = async (registerProps: RegisterProps) => {
  const apiResult = await apiCall<AuthResult>(POST, '/auth/register', registerProps);

  return auth(apiResult);
};
