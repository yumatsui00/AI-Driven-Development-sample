export type Lang = "jp" | "en" | "fr";

export interface TranslationObject {
  appName: string;
  tagline: string;
  description: string;
  cta: string;
  login: string;
  signup: string;
  language: string;
  languages: Record<Lang, string>;
  aiSummary: string;
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
}

export interface LandingHeaderProps {
  lang: Lang;
  translation: TranslationObject;
  onChangeLang: (lang: Lang) => void;
}

export interface LandingHeroProps {
  translation: TranslationObject;
}

export interface LandingLayoutProps {
  lang: Lang;
  translation: TranslationObject;
  onChangeLang: (lang: Lang) => void;
}
