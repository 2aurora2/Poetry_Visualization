<template>
  <div class="app-container">
    <div class="global-bg"></div>
    <NavbarComp v-if="!isEntry" />
    <router-view />
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

<script setup lang="ts">
import NavbarComp from './components/NavbarComp.vue';
import router from './router'
import { ref, watch } from 'vue';

const isEntry = ref(false);

watch(() => router.currentRoute.value.path, (newRoute) => {
  isEntry.value = newRoute === '/';
}, {
  immediate: true
})

</script>
