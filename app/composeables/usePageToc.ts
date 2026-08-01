import { useState } from "#imports";

export interface PageTocState {
  hasDownloads: boolean;
  hasParticipants: boolean;
  onlineCount: number;
  totalCount: number;
}

/**
 * Shared state describing which sections are present on the current page,
 * so the NavBar can render matching table-of-contents links next to the logo.
 */
export const usePageToc = () =>
  useState<PageTocState>("page-toc", () => ({
    hasDownloads: false,
    hasParticipants: false,
    onlineCount: 0,
    totalCount: 0,
  }));
