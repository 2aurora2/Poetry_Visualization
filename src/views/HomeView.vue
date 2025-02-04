<template>
  <div class="home-container">
    <div class="content">
      <relation-graph-comp source=""/>
    </div>
  </div>
</template>

<script setup lang="ts">
import RelationGraphComp from '@/components/RelationGraphComp.vue';
</script>

<style scoped lang="scss">
.home-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
