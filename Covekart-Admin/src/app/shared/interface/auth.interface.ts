export interface AuthUserStateModel {
  token: string | number;
  access_token: string;
  permissions: any;
  email: string;
  password: string;
}

export interface AuthUserForgotModel {
  email: string;
}

export interface VerifyEmailOtpModel {
  email: string;
  token: number;
}

export interface UpdatePasswordModel {
  password: string;
  password_confirmation: string;
  email: string;
  token: number;
}
