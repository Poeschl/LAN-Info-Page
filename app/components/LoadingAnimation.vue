<template>
  <div class="icon">
    <FontAwesomeIcon :icon="iconData.icon" :class="iconClass"/>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = withDefaults(
  defineProps<{
    sizeClass?: string;
  }>(),
  {
    sizeClass: "fa-lg",
  },
);

const iconClass = computed(() => {
  return `${props.sizeClass} ${iconData.value.animationClass}`;
});

const iconData = computed<{ icon: string; animationClass: string }>(() => {
  return { icon: "fa-solid fa-circle-notch", animationClass: "fa-spin-pulse" };
});
</script>

<style scoped lang="scss">
.icon {
  --bulma-icon-dimensions-large: 5.4rem;
}
</style>
