import { useRequestFetch } from "#imports";
import type { LinksResponse } from "#shared/models/Link";

export const useLinksApi = () => {
  const requestFetch = useRequestFetch();

  const getLinks = async (): Promise<LinksResponse> => {
    return requestFetch("/api/links");
  };

  return { getLinks };
};
