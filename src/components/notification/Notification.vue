<template>
  <div class="notification-container">
    <v-slide-x-reverse-transition group>
      <v-alert
        v-for="(notification, i) of $store.state.notification.notifications"
        :key="i"
        :value="notification.visible"
        :border="notification.border"
        :elevation="notification.elevation"
        :color="notification.color"
        :icon="notification.icon"
        :type="notification.type"
        :width="notification.width"
        colored-border
        style="white-space: pre-wrap; margin-bottom: 8px"
      >
        {{ $t(notification.message) }}
      </v-alert>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>

</script>

<style scoped>
.notification-container {
  position: absolute;
}
</style>
