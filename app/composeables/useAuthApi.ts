import type { AuthInfo } from "#shared/models/Auth";

export const useAuthApi = () => {
  const oidcUrl = "/auth/oidc";

  const getLoginInfo = async (): Promise<AuthInfo> => {
    return $fetch("/api/auth");
  };

  return { getLoginInfo, oidcUrl };
};
