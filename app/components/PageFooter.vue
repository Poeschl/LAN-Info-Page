<template>
  <footer class="footer is-flex is-justify-content-center">
    <div class="is-flex is-justify-content-center pt-1 footer-divider">
      <a class="button is-text" href="https://github.com/Poeschl/LAN-Info-Page" target="_blank" title="Source">
        <div class="icon">
          <FontAwesomeIcon icon="fa-brands fa-github" class="fa-xl"/>
        </div>
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
</script>

<style scoped lang="scss">
@use "bulma/sass/utilities/initial-variables";

.footer-divider {
  width: 25%;
  border-top-style: solid;
  border-top-color: initial-variables.$black-ter;
}
</style>
