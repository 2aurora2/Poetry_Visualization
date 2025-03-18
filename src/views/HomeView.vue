<template>
  <div class="container">
    <div class="button-container">
      <button v-for="(dynasty, index) in dynasties" :key="index"
        :class="['dynasty-button', { active: selectedDynasty === index }]" @click="selectDynasty(index)">
        {{ dynasty }}
      </button>
    </div>
    <div class="chart-container">
      <div class="left-column aside-container">
        <SubMapComp :mType="subMapType[selectedDynasty][0]" :data="subMapData[selectedDynasty][0]"
          :ratio="ratios[selectedDynasty]" />
        <div class="intro-txt">
          {{ subMapIntro[dynasties[selectedDynasty]][0] }}
        </div>
        <BarChartComp :selected-dynasty="selectedDynasty" />
      </div>
      <div class="middle-column">
        <ChinaMapComp :data="regionData[selectedDynasty]" :ratio="ratios[selectedDynasty]" />
      </div>
      <div class="right-column aside-container">
        <SubMapComp :mType="subMapType[selectedDynasty][1]" :data="subMapData[selectedDynasty][1]"
          :ratio="ratios[selectedDynasty]" />
        <div class="intro-txt">
          {{ subMapIntro[dynasties[selectedDynasty]][1] }}
        </div>
        <ScatterComp :selected-dynasty="selectedDynasty" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import 'element-plus/dist/index.css';
import BarChartComp from '../components/BarChartComp.vue';
import ScatterComp from '../components/ScatterComp.vue';
import ChinaMapComp from '../components/ChinaMapComp.vue';
import SubMapComp from '../components/SubMapComp.vue';

import tangRegionData from '@/assets/data/tang/region.json';
import songRegionData from '@/assets/data/song/region.json';
import yuanRegionData from '@/assets/data/yuan/region.json';

import tangSubRegionLeftData from '@/assets/data/tang/sub_region_left.json';
import songSubRegionLeftData from '@/assets/data/song/sub_region_left.json';
import yuanSubRegionLeftData from '@/assets/data/yuan/sub_region_left.json';
import tangSubRegionRightData from '@/assets/data/tang/sub_region_right.json';
import songSubRegionRightData from '@/assets/data/song/sub_region_right.json';
import yuanSubRegionRightData from '@/assets/data/yuan/sub_region_right.json';

import subMapIntro from '@/assets/data/sub_map_intro.json'

// tang: left-0, right-1
// song: left-1, right-2
// yuan: left-3, right-1
const subMapData = [[tangSubRegionLeftData, tangSubRegionRightData], [songSubRegionLeftData, songSubRegionRightData], [yuanSubRegionLeftData, yuanSubRegionRightData]];
const subMapType = [[0, 1], [2, 3], [4, 5]];

const dynasties = ['唐', '宋', '元'];
const selectedDynasty = ref(0);
const regionData = [tangRegionData, songRegionData, yuanRegionData];
const ratios = [1.5, 2.1, 3.1];

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
  position: relative;
}

.tour-button {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  z-index: 100;
  cursor: pointer;
  border: none;
  background-image: url('../assets/images/guide.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
  padding: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.tour-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.2);
}

.button-container {
  height: 45px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.button-container button:nth-child(1) {
  background-image: url('../assets/images/dynasty/tang.png');
}

.button-container button:nth-child(2) {
  background-image: url('../assets/images/dynasty/song.png');
}

.button-container button:nth-child(3) {
  background-image: url('../assets/images/dynasty/yuan.png');
}

.dynasty-button {
  width: 32px;
  height: 32px;
  font-family: 'TitleFont';
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
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

.aside-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .intro-txt {
    font-family: 'ContentFont';
    font-size: 20px;
    margin-top: 8px;
    width: 90%;
    margin-bottom: 8%;
  }
}
</style>
