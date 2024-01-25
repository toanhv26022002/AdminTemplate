<script setup>
import { goToLogin, logout } from '@/plugins/middleware/auth';
import miscMaskDark from '@images/pages/misc-mask-dark.png';
import miscMaskLight from '@images/pages/misc-mask-light.png';
import { useTheme } from 'vuetify';
const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? miscMaskLight : miscMaskDark
})
const loginAgain = async () => {
  await logout()
  goToLogin()
}
const goToEofactory = () => {
  window.location.href = config.url_eofactory
}
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      status-code="403"
      title="Access Denied ⚠️"
      description="You do not have permission to access this resource"
    />

    <!-- 👉 Image -->

    <div class="btn-container">
      <VBtn
        @click="loginAgain"
        class="mt-10 w-80"
      >
        Use another account
      </VBtn>
      <VBtn
        @click="goToEofactory"
        class="mt-10 w-80"
      >
        Go to Eofactory
      </VBtn>
    </div>
  </div>
</template>

<style lang="scss">
@use '@core/scss/pages/misc.scss';

.misc-footer-tree {
  inline-size: 15.625rem;
  inset-block-end: 3.5rem;
  inset-inline-start: 0.375rem;
}
.btn-container {
  display: flex;
  justify-content: space-between;
  width: 400px;
}
</style>
