import { useRequestFetch } from "#imports";
import type { AuthInfo } from "#shared/models/Auth";

export const useAuthApi = () => {
  const oidcUrl = "/auth/oidc";
  const requestFetch = useRequestFetch();

  const getLoginInfo = async (): Promise<AuthInfo> => {
    return requestFetch("/api/auth");
  };

  return { getLoginInfo, oidcUrl };
};
