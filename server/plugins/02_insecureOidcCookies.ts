import { defineNitroPlugin } from "#imports";
import { applicationEnv } from "~~/Env";
import { useServerLogger } from "~~/server/plugins/00_logging";

// nuxt-auth-utils hardcodes `secure: !isDevelopment` for its OIDC state/pkce/nonce cookies, so they
// are always sent as "Secure" in production, regardless of the actual request protocol. Behind a
// reverse proxy that only terminates plain HTTP, browsers drop these cookies, breaking the OIDC
// login flow with a "state mismatch" error. This plugin strips "Secure" from those specific cookies
// again as a workaround for such deployments; it is opt-in since it weakens cookie security.
const OIDC_COOKIE_NAMES = [
  "nuxt-auth-state",
  "nuxt-auth-pkce",
  "nuxt-auth-nonce",
];

export default defineNitroPlugin((nitroApp) => {
  if (!applicationEnv.oidcAllowInsecureCookies) {
    return;
  }

  const logger = useServerLogger().getLogger("OIDC");
  logger.warn(
    "oidcAllowInsecureCookies is enabled: OIDC login cookies are served without the 'Secure' attribute. " +
      "Only use this for trusted HTTP-only deployments; prefer enabling HTTPS instead.",
  );

  nitroApp.hooks.hook("beforeResponse", (event) => {
    const setCookieHeader = event.node.res.getHeader("set-cookie");
    if (!setCookieHeader) {
      return;
    }

    const cookies = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : [String(setCookieHeader)];
    const patchedCookies = cookies.map((cookie) => {
      const isOidcCookie = OIDC_COOKIE_NAMES.some((name) =>
        cookie.startsWith(`${name}=`),
      );
      return isOidcCookie ? cookie.replace(/;\s*Secure/i, "") : cookie;
    });

    event.node.res.setHeader("set-cookie", patchedCookies);
  });
});
