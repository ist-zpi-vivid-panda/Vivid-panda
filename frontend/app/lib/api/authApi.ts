import { apiCall, ApiResponse, POST, postCall } from '@/app/lib/api/apiUtils';
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

export type RequestSendPasswordProps = {
  email: string;
};

export type ChangePasswordProps = {
  password: string;
  password_repeated: string;
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
  const apiResult = await postCall<AuthResult>('/auth/login', loginProps);

  return auth(apiResult);
};

export const registerUser = async (registerProps: RegisterProps) => {
  const apiResult = await postCall<AuthResult>('/auth/register', registerProps);

  return auth(apiResult);
};

export const sendEmail = async (sendPassword: RequestSendPasswordProps) => {
  const apiResult = await postCall('/auth/request_reset_password', sendPassword);

  return !!apiResult;
};

export const changePassword = async (changePassword: ChangePasswordProps, resetCode: string, userId: string) => {
  const apiResult = await postCall(`/auth/reset_password/${resetCode}/${userId}`, changePassword);

  return !!apiResult;
};
