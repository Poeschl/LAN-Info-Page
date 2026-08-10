import { defineNitroPlugin, useRuntimeConfig } from "#imports";
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

function stripSecureFromOidcCookies(
  value: number | string | readonly string[],
): string | string[] {
  const cookies = Array.isArray(value) ? value : [String(value)];
  return cookies.map((cookie) => {
    const isOidcCookie = OIDC_COOKIE_NAMES.some((name) =>
      cookie.startsWith(`${name}=`),
    );
    return isOidcCookie ? cookie.replace(/;\s*Secure/i, "") : cookie;
  });
}

export default defineNitroPlugin((nitroApp) => {
  if (!useRuntimeConfig().oidcAllowInsecureCookies) {
    return;
  }

  const logger = useServerLogger().getLogger("InsecureOidcCookies");
  logger.warn(
    "oidcAllowInsecureCookies is enabled: OIDC login cookies are served without the 'Secure' attribute. ",
    "Only use this for trusted HTTP-only deployments; prefer enabling HTTPS instead.",
  );

  // `beforeResponse` is too late here because h3's `sendRedirect()` ends the response first, so we patch
  // `res.setHeader`/`res.appendHeader` at request start to strip `Secure` before the cookie is written.
  nitroApp.hooks.hook("request", (event) => {
    const res = event.node.res;
    const originalSetHeader = res.setHeader.bind(res);
    const originalAppendHeader = res.appendHeader.bind(res);

    res.setHeader = ((
      name: string,
      value: number | string | readonly string[],
    ) => {
      if (name.toLowerCase() === "set-cookie") {
        value = stripSecureFromOidcCookies(value);
      }
      return originalSetHeader(name, value);
    }) as typeof res.setHeader;

    res.appendHeader = ((name: string, value: string | readonly string[]) => {
      if (name.toLowerCase() === "set-cookie") {
        value = stripSecureFromOidcCookies(value);
      }
      return originalAppendHeader(name, value);
    }) as typeof res.appendHeader;
  });
});
