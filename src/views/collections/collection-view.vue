<template>
  <div class="collection-container">
    <RouterView />
  </div>
</template>

<style scoped>
.collection-container {
  position: relative;
  padding: 0 32px 40px;
  /* width: calc(100%-70px); */
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
