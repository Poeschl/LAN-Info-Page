import { beforeEach, describe, expect, it, vi } from "vitest";
import type { H3Event } from "h3";

import { AuthService } from "~~/server/services/AuthService";
import { applicationEnv } from "~~/Env";
import { AuthMethod } from "#shared/models/Auth";

const getUserSession = vi.fn();

(global as Record<string, unknown>).getUserSession = getUserSession;

describe("AuthService", () => {
  let service: AuthService;
  const event = {} as H3Event;

  beforeEach(() => {
    vi.clearAllMocks();
    // reset singleton
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (AuthService as any).instance = undefined;
    applicationEnv.oidcClientId = "";
    applicationEnv.oidcClientSecret = "";
    applicationEnv.oidcOpenidAutoDiscoveryUrl = "";
    service = AuthService.getInstance();
  });

  describe("activeAuth", () => {
    it("should return OIDC method when all OIDC settings are configured", () => {
      // given
      applicationEnv.oidcClientId = "client-id";
      applicationEnv.oidcClientSecret = "client-secret";
      applicationEnv.oidcOpenidAutoDiscoveryUrl =
        "https://idp.example.com/.well-known/openid-configuration";

      // when
      const result = service.activeAuth();

      // then
      expect(result).toEqual({ method: AuthMethod.OIDC });
    });

    it("should return NONE method when OIDC settings are missing", () => {
      // given
      applicationEnv.oidcClientId = "";
      applicationEnv.oidcClientSecret = "";
      applicationEnv.oidcOpenidAutoDiscoveryUrl = "";

      // when
      const result = service.activeAuth();

      // then
      expect(result).toEqual({ method: AuthMethod.NONE });
    });

    it("should return NONE method when only some OIDC settings are configured", () => {
      // given
      applicationEnv.oidcClientId = "client-id";
      applicationEnv.oidcClientSecret = "";
      applicationEnv.oidcOpenidAutoDiscoveryUrl = "";

      // when
      const result = service.activeAuth();

      // then
      expect(result).toEqual({ method: AuthMethod.NONE });
    });
  });

  describe("isAdmin", () => {
    it("should return true when the session user has the admin role", async () => {
      // given
      getUserSession.mockResolvedValue({
        user: {
          username: "alice",
          email: "alice@example.com",
          roles: ["lan_page_admin"],
        },
      });

      // when
      const result = await service.isAdmin(event);

      // then
      expect(result).toBe(true);
    });

    it("should return false when the session user does not have the admin role", async () => {
      // given
      getUserSession.mockResolvedValue({
        user: {
          username: "bob",
          email: "bob@example.com",
          roles: ["some_other_role"],
        },
      });

      // when
      const result = await service.isAdmin(event);

      // then
      expect(result).toBe(false);
    });

    it("should return false when there is no logged in user", async () => {
      // given
      getUserSession.mockResolvedValue({});

      // when
      const result = await service.isAdmin(event);

      // then
      expect(result).toBe(false);
    });
  });
});
