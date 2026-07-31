import type { DownloadFileCategory } from "#shared/utils/downloadFileTypes";

export interface DownloadFile {
  name: string;
  size: number;
  url: string;
  category: DownloadFileCategory;
}

export interface DownloadsResponse {
  files: DownloadFile[];
}
