<script setup>
import { onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
onMounted(() => {
	store.dispatch('initMap', 'map')
})
</script>

<template>
	<div id="map" style="width: 100%; height: 100%;"></div>
</template>
