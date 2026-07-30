<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div data-theme="dark" class="mb-5 mt-5">
    <main class="container is-touch-padded">
      <div class="box is-flex is-flex-direction-column is-align-items-center p-6">
        <div class="icon is-large has-text-danger mb-4">
          <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" class="fa-4x"/>
        </div>
        <h1 class="title is-1 has-text-danger mb-4">
          {{ error.statusCode }}
        </h1>
        <p class="subtitle is-4 mb-5">
          {{ error.message }}
        </p>
        <NuxtLink to="/" class="button is-primary is-medium">
          <span class="icon">
            <FontAwesomeIcon icon="fa-solid fa-home"/>
          </span>
          <span>Back to Home</span>
        </NuxtLink>
      </div>
    </main>
    <PageFooter />
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import PageFooter from "~/components/PageFooter.vue";

defineProps({
  error: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
@use "bulma/sass/utilities/initial-variables";

.footer-divider {
  width: 25%;
  border-top-style: solid;
  border-top-color: initial-variables.$black-ter;
}
</style>
