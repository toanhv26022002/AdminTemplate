<script setup>
import { goToLogin, logout } from '@/plugins/middleware/auth'

const loginAgain = async () => {
  await logout()
  goToLogin()
}
const goToEofactory = () => {
  window.location.href = config.url_eofactory
}
</script>

<template>
  <div class="page-403-container">
    <ErrorHeader
      status-code="403"
      title="Access Denied ⚠️"
      description="You do not have permission to access this resource"
    />

    <div class="btn-container">
      <v-btn
        class="custom-btn"
        @click="loginAgain"
        ><span class="font-bold">{{ $t('loginAgain') }}</span></v-btn
      >
      <v-spacer style="width: 40px"></v-spacer>
      <v-btn
        class="custom-btn"
        @click="goToEofactory"
        ><span class="font-bold">{{ $t('goToEofactory') }}</span></v-btn
      >
    </div>
  </div>
</template>
<style scoped>
.page-403-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.btn-container {
  display: flex;
  flex-direction: row;
}

.custom-btn {
  display: flex;
  align-items: center;
  background-color: red;
  margin-right: 10px;
  color: white;
  padding: 25px;
  font-weight: bold !important;
  width: 200px;
}

.warning {
  display: flex;
  flex-direction: column;
  font-size: 30px;
  align-items: center;
  padding-bottom: 40px;
  color: black;
}
.font-bold {
  font-weight: bold;
}
</style>
