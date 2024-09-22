import { ApiResponse, postCall } from '@/app/lib/api/apiUtils';
import { UserInfo } from '@/app/lib/storage/useUserData';
import { toast } from 'react-toastify';

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

const AUTH_ENDPOINT = '/auth' as const;
const LOGIN_ENDPOINT = '/login' as const;
const REGISTER_ENDPOINT = '/register' as const;
const REQUEST_RESET_PASSWORD_ENDPOINT = 'request_reset_password' as const;
const RESET_PASSWORD_ENDPOINT = 'reset_password' as const;

const TOKEN_QS = 'token' as const;
const USER_ID_QS = 'user_id' as const;

const auth = async (apiCallFn: () => Promise<AuthResult>) => {
  try {
    const apiResult = await apiCallFn();

    if (!apiResult) {
      return;
    }

    if (!apiResult.access_token || !apiResult.refresh_token) {
      return;
    }

    return {
      accessToken: apiResult.access_token,
      refreshToken: apiResult.refresh_token,
    } as UserInfo;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }
};

export const loginUser = async (loginProps: LoginProps) => {
  return auth(() => postCall<AuthResult>(AUTH_ENDPOINT + LOGIN_ENDPOINT, loginProps));
};

export const registerUser = async (registerProps: RegisterProps) => {
  return auth(() => postCall<AuthResult>(AUTH_ENDPOINT + REGISTER_ENDPOINT, registerProps));
};

export const sendEmail = async (sendPassword: RequestSendPasswordProps) => {
  const apiResult = await postCall(AUTH_ENDPOINT + REQUEST_RESET_PASSWORD_ENDPOINT, sendPassword);

  return !!apiResult;
};

export const changePassword = async (changePassword: ChangePasswordProps, resetCode: string, userId: string) => {
  const apiResult = await postCall(
    `${AUTH_ENDPOINT}${RESET_PASSWORD_ENDPOINT}?${TOKEN_QS}=${resetCode}&${USER_ID_QS}=${userId}`,
    changePassword
  );

  return !!apiResult;
};
