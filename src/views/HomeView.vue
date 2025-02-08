<template>
  <div class="home-container">
    <div class="content">
      <WordCloudComp :words="wordData"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import WordCloudComp from "@/components/WordCloudComp.vue";
import wordData from "@/assets/data/song/word_shuang.json";
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
