export type AuthUser = {
  id: string;
  email: string;
  password: string;
  created_at: string;
};

export type SignupInput = {
  email: string;
  password: string;
};

export type LoginInput = SignupInput;

export type Session = {
  login: boolean;
  userId: string;
  email: string;
};

export type AuthTranslations = {
  auth: {
    signupTitle: string;
    signupSubtitle: string;
    loginTitle: string;
    loginSubtitle: string;
    emailLabel: string;
    passwordLabel: string;
    signupAction: string;
    loginAction: string;
    logout: string;
    dashboardTitle: string;
    welcome: string;
    sessionMissing: string;
    duplicatedEmail: string;
    invalidCredentials: string;
  };
};
