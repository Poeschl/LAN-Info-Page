<template>
  <nav class="navbar is-primary is-radiusless" role="navigation">
    <div class="container">
      <div class="navbar-brand">
        <a href="/" class="navbar-item">
          <img class="mr-2" src="/img/icon_white.png">
          <span class="is-size-5">LAN Info</span>
        </a>
        <a href="#links" class="navbar-item">
          <span class="icon"><FontAwesomeIcon icon="fa-solid fa-link"/></span>
          <span>Links</span>
        </a>
        <a href="#downloads" class="navbar-item" v-if="pageToc.hasDownloads">
          <span class="icon"><FontAwesomeIcon icon="fa-solid fa-download"/></span>
          <span>Downloads</span>
        </a>
        <a href="#participants" class="navbar-item" v-if="pageToc.hasParticipants">
          <span class="icon"><FontAwesomeIcon icon="fa-solid fa-users"/></span>
          <span>Participants Stats</span>
        </a>
        <a role="button" class="navbar-burger" data-target="menuItems" :class="{ 'is-active': mobileNavOpen }" @click="toggleMobileNav">
          <span aria-hidden="true"/>
          <span aria-hidden="true"/>
          <span aria-hidden="true"/>
          <span aria-hidden="true"/>
        </a>
      </div>

      <div id="menuItems" class="navbar-menu" :class="{ 'is-active': mobileNavOpen }">
        <div class="navbar-end">
          <a
            class="navbar-item"
            :class="{ 'is-login-disabled': isLoginDisabled }"
            :href="isLoginDisabled ? undefined : authApi.oidcUrl"
            :aria-disabled="isLoginDisabled"
            :tabindex="isLoginDisabled ? -1 : undefined"
            v-if="!loggedIn"
          >
            <div class="icon-text">
              <div class="icon">
                <FontAwesomeIcon icon="fa-regular fa-user"/>
              </div>
              <span>Login</span>
            </div>
          </a>
          <NavbarUserComponent/>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useUserSession } from "#imports";
import { useAuthApi } from "~/composeables/useAuthApi";
import { usePageToc } from "~/composeables/usePageToc";
import { AuthMethod } from "#shared/models/Auth";

const mobileNavOpen = ref<boolean>(false);
const loggedIn = computed(() => useUserSession().loggedIn.value);
const authApi = useAuthApi();
const pageToc = usePageToc();
const { data: loginInfo } = await useAsyncData(
  "auth-info",
  authApi.getLoginInfo,
);
const isLoginDisabled = computed(
  () => loginInfo.value?.method !== AuthMethod.OIDC,
);

const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value;
};
</script>

<style scoped lang="scss">
.is-login-disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
</style>
