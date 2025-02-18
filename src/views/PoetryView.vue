<template>
    <div class="analysis-container">
      <!-- 上部分：词云图、气泡图、情感分析饼图 -->
      <div class="top-row">
        <div class="chart-section">
          <div class="dynasty-choose">
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
        <div class="chart-section bubble-chart">
          <BubbleChart :words="selectedBubbleChartWords" />
        </div>
        <div class="chart-section">
          <EmotionPieComp />
        </div>
      </div>
  
      <!-- 下部分：时间轴 -->
      <div class="bottom-row">
        <TimelineScatterComp />
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref } from 'vue';
import WordCloudComp from '@/components/WordCloudComp.vue';
import BubbleChart from '@/components/BubbleChart.vue';
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

  .top-row {
    display: flex;
    gap: 10px; 
    width: 100%;
    height: 60%;
    align-items: center; 

    .chart-section {
      flex: 1;
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
    }

    .bubble-chart {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .bottom-row {
    width: 100%;
    height: 40%; 
    display: flex;
    justify-content: center; 
    align-items: center; 
  }
}
</style>