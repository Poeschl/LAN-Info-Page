import { defineOAuthOidcEventHandler } from "#imports";
import { applicationEnv } from "~~/Env";
import { jwtDecode } from "jwt-decode";
import { useServerLogger } from "~~/server/plugins/00_logging";
import { ADMIN_ROLE } from "~~/server/services/AuthService";

export default defineOAuthOidcEventHandler({
  config: {
    clientId: applicationEnv.oidcClientId || "",
    clientSecret: applicationEnv.oidcClientSecret || "",
    openidConfig: applicationEnv.oidcOpenidAutoDiscoveryUrl || "",
    scope: ["openid", "email"],
  },
  async onSuccess(event, { user, tokens }) {
    const logger = useServerLogger().getLogger("OIDC");

    let roles: string[] = [];
    try {
      roles = jwtDecode<{ roles?: string[] }>(tokens.access_token).roles ?? [];
    } catch (error) {
      logger.warn("Could not decode roles from access token:", error);
    }

    // The page itself is public, so every authenticated user is allowed to log in.
    // Only users with the admin role get access to the admin-only links.
    await setUserSession(event, {
      user: {
        username: user.preferred_username!,
        email: user.email!,
        roles,
      },
    });

    if (roles.includes(ADMIN_ROLE)) {
      logger.info(`User ${user.preferred_username} logged in with admin role`);
    }

    return sendRedirect(event, "/");
  },
  onError(event, error) {
    const logger = useServerLogger().getLogger("OIDC");
    logger.error("Error:", error);
    return sendRedirect(event, "/");
  },
});
