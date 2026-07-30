<template>
  <div class="navbar-item" v-if="loggedIn">
    <div class="icon-text">
        <span class="icon">
          <FontAwesomeIcon icon="fa-regular fa-user" class="mr-1"/>
        </span>
      <span class="username">@{{ userSession.user.value.username }}</span>
    </div>
  </div>
  <a class="navbar-item" v-if="loggedIn" title="Logout" @click="logout">
    <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket"/>
  </a>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useUserSession } from "#imports";

const userSession = useUserSession();
const loggedIn = computed(() => userSession.loggedIn.value);

const logout = async () => {
  await userSession.clear();
  navigateTo("/login");
};
</script>
