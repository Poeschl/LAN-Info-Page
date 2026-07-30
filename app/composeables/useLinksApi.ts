import type { LinksResponse } from "#shared/models/Link";

export const useLinksApi = () => {
  const getLinks = async (): Promise<LinksResponse> => {
    return $fetch("/api/links");
  };

  return { getLinks };
};
