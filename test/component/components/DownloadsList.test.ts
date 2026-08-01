import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DownloadsList from "../../../app/components/DownloadsList.vue";
import type { DownloadFile } from "../../../shared/models/DownloadFile";

describe("DownloadsList", () => {
  it("should render nothing when there are no files", async () => {
    // given
    const component = await mountSuspended(DownloadsList, {
      props: { files: [] },
    });

    // when
    const html = component.html();

    // then
    expect(html).toBe("<!--v-if-->");
  });

  it("should render a download link for each file with a human readable size", async () => {
    // given
    const files: DownloadFile[] = [
      {
        name: "map-pack.zip",
        size: 2048,
        url: "/api/downloads/map-pack.zip",
        category: "archive",
      },
      {
        name: "setup.exe",
        size: 500,
        url: "/api/downloads/setup.exe",
        category: "installer",
      },
    ];

    // when
    const component = await mountSuspended(DownloadsList, {
      props: { files },
    });
    const links = component.findAll("a");

    // then
    expect(links).toHaveLength(2);
    expect(links[0].attributes("href")).toBe("/api/downloads/map-pack.zip");
    expect(links[0].text()).toContain("map-pack.zip");
    expect(links[0].text()).toContain("2.0 KB");
    expect(links[1].text()).toContain("500 B");
  });

  it("should use a different icon per file category", async () => {
    // given
    const files: DownloadFile[] = [
      {
        name: "map-pack.zip",
        size: 2048,
        url: "/api/downloads/map-pack.zip",
        category: "archive",
      },
      {
        name: "setup.exe",
        size: 500,
        url: "/api/downloads/setup.exe",
        category: "installer",
      },
      {
        name: "notes.pdf",
        size: 500,
        url: "/api/downloads/notes.pdf",
        category: "other",
      },
    ];

    // when
    const component = await mountSuspended(DownloadsList, {
      props: { files },
    });
    const icons = component.findAllComponents({ name: "FontAwesomeIcon" });

    // then (index 0 is the header download icon)
    expect(icons).toHaveLength(4);
    expect(icons[1].props("icon")).toBe("fa-solid fa-file-zipper");
    expect(icons[2].props("icon")).toBe("fa-solid fa-gear");
    expect(icons[3].props("icon")).toBe("fa-solid fa-file");
  });
});
