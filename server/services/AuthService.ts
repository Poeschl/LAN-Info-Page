import { useServerLogger } from "~~/server/plugins/00_logging";
import { applicationEnv } from "~~/Env";
import type { H3Event } from "h3";
import { type AuthInfo, AuthMethod } from "#shared/models/Auth";

export const ADMIN_ROLE = "lan_page_admin";

export class AuthService {
  private static instance: AuthService;
  private readonly log = useServerLogger().getLogger("AuthService");

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public activeAuth(): AuthInfo {
    if (this.isOIDCAuthActive()) {
      return { method: AuthMethod.OIDC };
    } else {
      // Fallback too NONE to signal that no authentication is active
      return { method: AuthMethod.NONE };
    }
  }

  /**
   * Checks whether the currently logged in user (if any) has the admin role.
   */
  public async isAdmin(event: H3Event): Promise<boolean> {
    const session = await getUserSession(event);
    return session.user?.roles?.includes(ADMIN_ROLE) ?? false;
  }

  private isOIDCAuthActive(): boolean {
    return (
      applicationEnv.oidcClientId.length > 0 &&
      applicationEnv.oidcClientSecret.length > 0 &&
      applicationEnv.oidcOpenidAutoDiscoveryUrl.length > 0
    );
  }
}

export function getAuthService(): AuthService {
  return AuthService.getInstance();
}
