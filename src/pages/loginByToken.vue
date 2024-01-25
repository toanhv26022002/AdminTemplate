<template>
</template>

<script>
import api from '@/api/Api';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    onMounted(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromURL = urlParams.get('token');
      if (tokenFromURL) {
        api.setToken(JSON.parse(atob(tokenFromURL)).access_token);
        window.history.replaceState({}, document.title, window.location.pathname);
        console.log('okeoko');
        router.push("/collections");
      } else {
        console.error('Token not found in the URL.');
      }
    });
  }
};
</script>

<style scoped>
.container {
  display: flex;
  font-size: 60px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
