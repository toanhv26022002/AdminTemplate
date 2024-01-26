<script setup>
import Notification from "@/components/notification/Notification.vue";
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue';

</script>

<template>
  <DefaultLayoutWithVerticalNav>
    <Notification style="top: 8px; right: 8px; z-index: 1000" />
    <RouterView />
  </DefaultLayoutWithVerticalNav>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
