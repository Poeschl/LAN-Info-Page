import { useRequestFetch } from "#imports";
import type { DownloadsResponse } from "#shared/models/DownloadFile";

export const useDownloadsApi = () => {
  const requestFetch = useRequestFetch();

  const getDownloads = async (): Promise<DownloadsResponse> => {
    return requestFetch("/api/downloads");
  };

  return { getDownloads };
};
