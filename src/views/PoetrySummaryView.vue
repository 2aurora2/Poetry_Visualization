<template>
  <div class="analysis-container">
    <div class="top-row">
      <div class="button-container">
        <button v-for="(dynasty, index) in dynasties" :key="index"
          :class="['dynasty-button', { active: selectedDynasty === index }]" @click="selectDynasty(index)">
          {{ dynasty }}
        </button>
      </div>
      <div class="charts">
        <div class="left">
          <PiePlaceComp />
        </div>
        <div class="middle">
          <WordCloudComp style="width: 100%;" :words="selectedWordCloudWords" />
        </div>
        <div class="right">
          <SunBurstComp />
        </div>
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
  align-items: center;

  .top-row {
    width: 99%;
    height: 58%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .button-container {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 10px;

      .dynasty-button {
        width: 32px;
        height: 32px;
        font-family: 'TitleFont';
        border-radius: 50%;
        background-size: cover;
        /* 覆盖整个容器 */
        background-position: center;
        /* 图片居中显示 */
        background-repeat: no-repeat;
        /* 禁止重复平铺 */
        border: none;
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
    }

    .charts {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 2%;
      

      .left {
        width: 30%;
        height: 100%;
      }

      .middle {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 40%;
        height: 100%;
        justify-content: center;
        align-items: center;
      }

      .right {
        width: 30%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .bottom-row {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 4%;

    p {
      font-family: 'TitleFont';
      margin: 0;
      font-size: 25px;
      font-weight: bolder;
    }
  }
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
</style>