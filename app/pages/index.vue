<template>
  <div>
    <div v-if="pending" class="is-flex is-justify-content-center py-6">
      <LoadingAnimation sizeClass="fa-2x"/>
    </div>

    <div v-else>
      <div v-if="links.length === 0" class="has-text-centered py-6">
        No links configured yet.
      </div>

      <div v-for="category in categories" :key="category" class="mb-5">
        <h2 class="title is-5">
{{ category }}
</h2>
        <div class="columns is-multiline">
          <div
              v-for="link in linksByCategory[category]"
              :key="link.id"
              class="column is-one-third-desktop is-half-tablet"
          >
            <a :href="link.url" target="_blank" rel="noopener noreferrer" class="box link-card">
              <div class="is-flex is-align-items-center">
                <img
                    v-if="link.imageUrl"
                    :src="link.imageUrl"
                    :alt="link.title"
                    class="link-image mr-3"
                >
                <span class="icon is-medium mr-3" v-else-if="link.icon">
                  <FontAwesomeIcon :icon="link.icon"/>
                </span>
                <div>
                  <div class="is-flex is-align-items-center">
                    <span class="has-text-weight-semibold">{{ link.title }}</span>
                    <span v-if="link.adminOnly" class="tag is-warning is-light ml-2">Admin</span>
                  </div>
                  <p v-if="link.description" class="is-size-7 has-text-grey">
                    {{ link.description }}
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div v-if="stats.length > 0" class="mb-5">
        <h2 class="title is-5">
Participants
</h2>
        <div class="table-container">
          <table class="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th/>
                <th>Player</th>
                <th>Hostname</th>
                <th>IP Address</th>
                <th>Mainboard</th>
                <th>CPU</th>
                <th>GPU</th>
                <th>OS</th>
                <th>Current Game</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stat in stats" :key="stat.id">
                <td>
                  <span
                      class="status-dot"
                      :class="stat.online ? 'is-online' : 'is-offline'"
                      :title="`Last online at ${formatLastSeen(stat.lastSeenAt)}`"
                  />
                </td>
                <td>{{ stat.playerName || "-" }}</td>
                <td>{{ stat.hostname || "-" }}</td>
                <td>{{ stat.ipv4Address || "-" }}</td>
                <td>{{ [stat.boardManufacturer, stat.baseboard].filter(Boolean).join(" ") || "-" }}</td>
                <td>{{ stat.cpu || "-" }}</td>
                <td>{{ stat.gpu || "-" }}</td>
                <td>{{ stat.windowsEdition || "-" }}</td>
                <td>{{ stat.currentGame || "-" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useLinksApi } from "~/composeables/useLinksApi";
import { useStatsApi } from "~/composeables/useStatsApi";
import LoadingAnimation from "~/components/LoadingAnimation.vue";
import type { Link } from "#shared/models/Link";
import type { PlayerStat } from "#shared/models/PlayerStat";

definePageMeta({
  isAuthorized: false,
});

const linksApi = useLinksApi();
const statsApi = useStatsApi();

const { data, pending } = await useAsyncData("links", () =>
  linksApi.getLinks(),
);

const { data: statsData } = await useAsyncData("stats", () =>
  statsApi.getStats(),
);

const links = computed<Link[]>(() => data.value?.links ?? []);
const stats = computed<PlayerStat[]>(() => statsData.value?.stats ?? []);

const categories = computed<string[]>(() => {
  const seen = new Set<string>();
  for (const link of links.value) {
    seen.add(link.category?.trim() || "General");
  }
  return Array.from(seen);
});

const linksByCategory = computed<Record<string, Link[]>>(() => {
  const grouped: Record<string, Link[]> = {};
  for (const link of links.value) {
    const category = link.category?.trim() || "General";
    grouped[category] ??= [];
    grouped[category].push(link);
  }
  return grouped;
});

const formatLastSeen = (isoTimestamp: string): string => {
  return new Date(isoTimestamp).toLocaleString();
};
</script>

<style scoped lang="scss">
.link-card {
  display: block;
  height: 100%;
  transition: transform 0.1s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
}

.link-image {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.status-dot {
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  cursor: default;

  &.is-online {
    background-color: hsl(141, 71%, 48%);
  }

  &.is-offline {
    background-color: hsl(348, 100%, 61%);
  }
}
</style>
