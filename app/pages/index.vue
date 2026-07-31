<template>
  <div>
    <div v-if="pending" class="is-flex is-justify-content-center py-6">
      <LoadingAnimation sizeClass="fa-2x"/>
    </div>

    <div v-else>
      <div class="section px-0">
        <LinkCollection :links="links"/>
      </div>
      <div class="section px-0" v-if="downloads.length > 0" >
        <DownloadsList :files="downloads"/>
      </div>
      <div class="section px-0" v-if="stats.length > 0" >
        <ParticipantsTable :stats="stats"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLinksApi } from "~/composeables/useLinksApi";
import { useDownloadsApi } from "~/composeables/useDownloadsApi";
import { useStatsApi } from "~/composeables/useStatsApi";
import LoadingAnimation from "~/components/LoadingAnimation.vue";
import DownloadsList from "~/components/DownloadsList.vue";
import type { Link } from "#shared/models/Link";
import type { DownloadFile } from "#shared/models/DownloadFile";
import type { PlayerStat } from "#shared/models/PlayerStat";

const linksApi = useLinksApi();
const downloadsApi = useDownloadsApi();
const statsApi = useStatsApi();

const { data, pending } = await useAsyncData("links", () =>
  linksApi.getLinks(),
);

const { data: downloadsData } = await useAsyncData("downloads", () =>
  downloadsApi.getDownloads(),
);

const { data: statsData } = await useAsyncData("stats", () =>
  statsApi.getStats(),
);

const links = computed<Link[]>(() => data.value?.links ?? []);
const downloads = computed<DownloadFile[]>(
  () => downloadsData.value?.files ?? [],
);
const stats = computed<PlayerStat[]>(() => statsData.value?.stats ?? []);
</script>
