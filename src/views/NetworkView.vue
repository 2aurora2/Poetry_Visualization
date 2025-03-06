<template>
  <div class="analysis-container">
    <div class="top-row">
      <div class="left">
        <div class="button-container">
          <button
            v-for="(dynasty, index) in dynasties"
            :key="index"
            :class="['dynasty-button', { active: selectedDynasty === index }]"
            @click="selectDynasty(index)"
          >
            {{ dynasty }}
          </button>
        </div>
        <WordCloudComp :words="selectedWordCloudWords" />
      </div>
      <div class="right">
        <SunBurstComp />
      </div>
    </div>
    <div class="bottom-row">
      <p>创作数量分布时间轴</p>
      <TimelineScatterComp />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import WordCloudComp from '@/components/WordCloudComp.vue';
import SunBurstComp from '@/components/SunBurstComp.vue';
import TimelineScatterComp from '@/components/TimelineScatterComp.vue';
import tangWordCloudWords from '@/assets/data/tang/word_shuang.json';
import songWordCloudWords from '@/assets/data/song/word_shuang.json';
import yuanWordCloudWords from '@/assets/data/yuan/word_shuang.json';

const selectedDynasty = ref(0);
const dynasties = ['唐', '宋', '元'];
const wordCloudWordsData = [tangWordCloudWords, songWordCloudWords, yuanWordCloudWords];
const selectedWordCloudWords = ref(wordCloudWordsData[selectedDynasty.value]);

const selectDynasty = (index: number) => {
  selectedDynasty.value = index;
  selectedWordCloudWords.value = wordCloudWordsData[index];
};
</script>

<style scoped lang="scss">
.analysis-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .top-row {
    width: 90%;
    height: 58%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .left {
      display: flex;
      flex-direction: row;
      gap: 10px;
      width: 48%; 
      align-items: center;

      .button-container {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .dynasty-button {
          width: 35px;
          height: 35px;
          font-family: 'TitleFont';
          border-radius: 50%;
          background-color: rgba(60, 60, 60, 0.1);
          border: 2px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 25px;
          font-weight: bold;
          color: #333;
          transition: all 0.3s ease;

          &:hover {
            background-color: rgba(60, 60, 60, 0.2);
          }
        }

        .active {
          background-color: #4CAF50;
          color: white;
          border-color: #4CAF50;
        }
      }
    }

    .right {
      width: 52%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .bottom-row {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
      font-family: 'TitleFont';
      margin: 0;
      font-size: 25px;
      font-weight: bolder;
    }
  }
}
</style>