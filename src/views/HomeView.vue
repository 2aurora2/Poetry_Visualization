<template>
  <div class="container">
    <div class="button-container">
      <button v-for="(dynasty, index) in dynasties" :key="index"
        :class="['dynasty-button', { active: selectedDynasty === index }]" @click="selectDynasty(index)">
        {{ dynasty }}
      </button>
    </div>
    <div class="chart-container">
      <div class="left-column">
        <BarChartComp :selected-dynasty="selectedDynasty" />
      </div>
      <div class="middle-column">
        <ChinaMapComp :data="regionData[selectedDynasty]" :ratio="ratios[selectedDynasty]" />
      </div>
      <div class="right-column">
        <ScatterComp :selected-dynasty="selectedDynasty" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BarChartComp from '../components/BarChartComp.vue';
import ScatterComp from '../components/ScatterComp.vue';
import ChinaMapComp from '../components/ChinaMapComp.vue';

import tangRegionData from '@/assets/data/tang/region.json';
import songRegionData from '@/assets/data/song/region.json';
import yuanRegionData from '@/assets/data/yuan/region.json';

const dynasties = ['唐', '宋', '元'];
const selectedDynasty = ref(0);
const regionData = [tangRegionData, songRegionData, yuanRegionData];
const ratios = [1.5, 2.1, 3.1]
const selectDynasty = (index: number) => {
  selectedDynasty.value = index;
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.button-container {
  height: 45px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.button-container button:nth-child(1){
  background-image: url('../assets/images/dynasty/tang.png');
}
.button-container button:nth-child(2){
  background-image: url('../assets/images/dynasty/song.png'); 
}
.button-container button:nth-child(3){
  background-image: url('../assets/images/dynasty/yuan.png'); 
}

.dynasty-button {
  width: 32px;
  height: 32px;
  font-family: 'TitleFont';
  border-radius: 50%;
  background-size: cover;       /* 覆盖整个容器 */
  background-position: center;  /* 图片居中显示 */
  background-repeat: no-repeat; /* 禁止重复平铺 */
  border:none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  color: #000000;
  transition: all 0.3s ease;
}

.active {
  width: 40px;
  height: 40px;
  font-size: 25px;
}

.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;

}

.left-column {
  flex: 1;
  margin-left: 64px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 32px;
}

.middle-column {
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-column {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-right: 64px;
  margin-bottom: 64px;
}
</style>