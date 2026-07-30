export interface AuthInfo {
  method: AuthMethod;
}

export enum AuthMethod {
  NONE = "none",
  OIDC = "oauth2",
}
