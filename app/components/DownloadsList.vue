<template>
  <div v-if="files.length > 0" class="mb-5">
    <h2 class="title is-4">
Downloads
</h2>
    <div class="columns is-multiline">
      <div
          v-for="file in files"
          :key="file.name"
          class="column is-one-third-desktop is-half-tablet"
      >
        <a :href="file.url" download class="box download-card">
          <div class="is-flex is-align-items-center">
            <span class="icon is-medium mr-3">
              <FontAwesomeIcon :icon="categoryIcon(file.category)" class="fa-xl"/>
            </span>
            <div>
              <span class="has-text-weight-semibold">{{ file.name }}</span>
              <p class="is-size-7 has-text-grey">
                {{ formatSize(file.size) }}
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { DownloadFile } from "#shared/models/DownloadFile";
import type { DownloadFileCategory } from "#shared/utils/downloadFileTypes";

defineProps<{
  files: DownloadFile[];
}>();

const CATEGORY_ICONS: Record<DownloadFileCategory, string> = {
  installer: "fa-solid fa-gear",
  archive: "fa-solid fa-file-zipper",
  other: "fa-solid fa-file",
};

const categoryIcon = (category: DownloadFileCategory): string =>
  CATEGORY_ICONS[category] ?? "fa-solid fa-file-arrow-down";

const formatSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
};
</script>

<style scoped lang="scss">
.download-card {
  display: block;
  height: 100%;
  transition: transform 0.1s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
}
</style>
