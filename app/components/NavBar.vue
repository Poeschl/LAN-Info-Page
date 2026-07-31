<template>
  <nav class="navbar is-primary is-radiusless" role="navigation">
    <div class="container">
      <div class="navbar-brand">
        <a href="/" class="navbar-item">
          <img class="mr-2" src="/img/icon_white.png">
          <span class="is-size-5">LAN Info</span>
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
          <a class="navbar-item" :href="authApi.oidcUrl" v-if="!loggedIn">
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

const mobileNavOpen = ref<boolean>(false);
const loggedIn = computed(() => useUserSession().loggedIn.value);
const authApi = useAuthApi();

const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value;
};
</script>

<style scoped lang="scss"></style>
