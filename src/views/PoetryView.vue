<template>
  <div class="analysis-container">
    <div class="top-row">
      <div class="word-section">
        <div class="dynasty-choose">
          <button v-for="(dynasty, index) in dynasties" :key="index"
            :class="['dynasty-button', { active: selectedDynasty === index }]" @click="selectDynasty(index)">
            {{ dynasty }}
          </button>
        </div>
        <div class="charts">
          <BubbleChartComp :words="selectedBubbleChartWords" />
          <WordCloudComp :words="selectedWordCloudWords" />
        </div>
      </div>
      <div class="pie-section">
        <EmotionPieComp />
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
import BubbleChartComp from '@/components/BubbleChartComp.vue';
import EmotionPieComp from '@/components/EmotionPieComp.vue';
import TimelineScatterComp from '@/components/TimelineScatterComp.vue';
import tangWordCloudWords from '@/assets/data/tang/word_shuang.json';
import songWordCloudWords from '@/assets/data/song/word_shuang.json';
import yuanWordCloudWords from '@/assets/data/yuan/word_shuang.json';
import tangBubbleChartWords from '@/assets/data/tang/word_dan.json';
import songBubbleChartWords from '@/assets/data/song/word_dan.json';
import yuanBubbleChartWords from '@/assets/data/yuan/word_dan.json';

const selectedDynasty = ref(0);
const dynasties = ['唐', '宋', '元'];

const wordCloudWordsData = [tangWordCloudWords, songWordCloudWords, yuanWordCloudWords];
const bubbleChartWordsData = [tangBubbleChartWords, songBubbleChartWords, yuanBubbleChartWords];

const selectedWordCloudWords = ref(wordCloudWordsData[selectedDynasty.value]);
const selectedBubbleChartWords = ref(bubbleChartWordsData[selectedDynasty.value]);

const selectDynasty = (index: number) => {
  selectedDynasty.value = index;
  selectedWordCloudWords.value = wordCloudWordsData[index];
  selectedBubbleChartWords.value = bubbleChartWordsData[index];
};
</script>

<style scoped lang="scss">
.analysis-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .top-row {
    display: flex;
    width: 85%;
    height: 60%;
    flex-direction: row;
    align-items: center;

    .word-section {
      flex: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;

      .dynasty-choose {
        width: 100%;
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-bottom: 10px;

        .dynasty-button {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background-color: rgba(60, 60, 60, 0.1);
          border: 2px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
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

      .charts {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        gap: 4px;
        align-items: center;
        justify-content: center;

        div {
          flex: 1
        }
      }
    }

    .pie-section {
      flex: 1;
      height: 60%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .bottom-row {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
      margin: 0;
      font-size: 18px;
      font-weight: bolder;
    }
  }
}
</style>