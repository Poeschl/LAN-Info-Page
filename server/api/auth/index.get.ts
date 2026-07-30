import { getAuthService } from "~~/server/services/AuthService";

export default defineEventHandler(async () => {
  return getAuthService().activeAuth();
});
