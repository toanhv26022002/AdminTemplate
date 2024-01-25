<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue';
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';
</script>

<template>
  <!-- 👉 Dashboards -->


  <!-- 👉 Front Pages -->

  <!-- 👉 Apps & Pages -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Stac',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Collections',
      icon: 'ri-folder-image-line',
      to: '/collections',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Items',
      icon: 'ri-file-image-line',
      to: '/items',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Map',
      icon: 'ri-map-2-line',
      to: '/map',
    }"
  />

  <!-- 👉 Apps & Pages -->
 
 
</template>
