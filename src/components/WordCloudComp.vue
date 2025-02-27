<template>
  <!-- 词云图容器 -->
  <div id="word-cloud" class="chart"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core';
import 'echarts-wordcloud'; // 引入词云图插件
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted, shallowRef, watch } from 'vue';
import vintage from '@/assets/theme/vintage.json'; // 引入主题 JSON

echarts.use([TitleComponent, TooltipComponent, CanvasRenderer]);

const props = defineProps({
  words: {
    type: Array,
    required: true
  }
});

let myChart = shallowRef();
const initChart = () => {
  if (myChart.value) {
    myChart.value.dispose();
  }
  const chartDom = document.getElementById('word-cloud'); // 获取 DOM 容器
  if (!chartDom) return;
  chartDom.style.width = '100%';
  chartDom.style.height = '90%';
  echarts.registerTheme('vintage', vintage); // 注册主题
  myChart.value = echarts.init(chartDom, 'vintage'); // 初始化 ECharts 实例
  updateChart(props.words);
};

const updateChart = (words: any[]) => {
  const filteredWords = words.sort((a, b) => b.value - a.value).slice(0, 85);
  var option;
  option = {
    tooltip: {
      show: true,
      formatter: (params: any) => `<b>${params.name}</b>: ${params.value}`,
      textStyle: {
        fontFamily: 'ContentFont',
        fontSize: 18,
      }
    },
    title: {
      text: '诗词双字词云图',
      left: 'center',
      textStyle: {
        fontFamily: 'TitleFont',
        fontSize: 25,
      }
    },
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        sizeRange: [15, 40],
        gridSize: 8,
        rotationRange: [0, 0],
        drawOutOfBound: false,
        textStyle: {
          fontFamily: 'STKaiti, KaiTi, serif',
          fontWeight: 'bold',
          color: () => Colors[Math.floor(Math.random() * Colors.length)],
          shadowBlur: 10,
          shadowColor: '#333'
        },
        data: filteredWords,
        emphasis: {
          //focus: 'self',
          textStyle: {
            fontSize: 32,
            fontWeight: 'bold',
            color: '#FF6B6B'
          }
        }
      }
    ],
    animationDurationUpdate: 5000,
    animationEasingUpdate: 'elasticOut'
  };

  myChart.value.setOption(option);
};

onMounted(initChart);

watch(() => props.words, updateChart, { deep: true });

// 主题颜色
const Colors = [
  "#d87c7c", "#919e8b",
  "#6e7074", "#61a0a8",
  "#787464", "#cc7e63",
  "#724e58", "#4b565b"
];
</script>

<style scoped></style>
