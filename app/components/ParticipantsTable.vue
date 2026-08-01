<template>
  <div class="mb-5">
    <h2 class="title is-4">
      <span class="icon-text">
        <span class="icon"><FontAwesomeIcon icon="fa-solid fa-users"/></span>
        <span>Participants Stats</span>
      </span>
    </h2>
    <div class="table-container">
      <table class="table is-fullwidth is-striped is-hoverable is-rounded">
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
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { PlayerStat } from "#shared/models/PlayerStat";

defineProps<{
  stats: PlayerStat[];
}>();

const formatLastSeen = (isoTimestamp: string): string => {
  return new Date(isoTimestamp).toLocaleString();
};
</script>

<style scoped lang="scss">
@use "bulma/sass/utilities/initial-variables";

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

table, table tbody tr {
  border-radius: initial-variables.$radius;
}
</style>
