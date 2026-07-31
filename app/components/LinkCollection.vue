<template>
  <div>
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
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { Link } from "#shared/models/Link";

const props = defineProps<{
  links: Link[];
}>();

const categories = computed<string[]>(() => {
  const seen = new Set<string>();
  for (const link of props.links) {
    seen.add(link.category?.trim() || "General");
  }
  return Array.from(seen);
});

const linksByCategory = computed<Record<string, Link[]>>(() => {
  const grouped: Record<string, Link[]> = {};
  for (const link of props.links) {
    const category = link.category?.trim() || "General";
    grouped[category] ??= [];
    grouped[category].push(link);
  }
  return grouped;
});
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
</style>
