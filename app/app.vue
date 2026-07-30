<template>
  <div data-theme="dark" class="mb-5">
    <NavBar class="mb-5"/>
    <main class="container is-touch-padded">
      <NuxtPage />
    </main>
    <PageFooter />
  </div>
</template>

<script setup lang="ts">
import PageFooter from "~/components/PageFooter.vue";
import { useHead, useSeoMeta } from "nuxt/app";

useHead({
  link: [
    {
      rel: "shortcut icon",
      type: "image/x-icon",
      href: "/img/favicon/favicon.ico",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/img/favicon/apple-touch-icon.png",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/img/favicon/favicon-32x32.png",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/img/favicon/favicon-16x16.png",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "shortcut icon",
      type: "image/x-icon",
      href: "/img/favicon_white/favicon.ico",
      media: "(prefers-color-scheme: dark)",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/img/favicon_white/apple-touch-icon.png",
      media: "(prefers-color-scheme: dark)",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/img/favicon_white/favicon-32x32.png",
      media: "(prefers-color-scheme: dark)",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/img/favicon_white/favicon-16x16.png",
      media: "(prefers-color-scheme: dark)",
    },
  ],
});

const title = "LAN-Page";
const description =
  "LAN-Page provides an easy way to share important links with LAN party participants and admins.";
useSeoMeta({
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  title: title,
  description: description,
  ogTitle: title,
  ogDescription: description,
  ogType: "website",
  ogImage: "/img/favicon/apple-touch-icon.png",
});
</script>

<style lang="scss">

</style>
