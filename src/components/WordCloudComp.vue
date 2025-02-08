<template>
  <!-- 词云图容器 -->
  <div id="word-cloud" style="width: 800px; height: 600px;"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core';
import 'echarts-wordcloud'; // 引入词云图插件
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted, watch } from 'vue';
import vintage from '@/assets/theme/vintage.json'; // 引入主题 JSON

// 注册 ECharts 组件
echarts.use([TitleComponent, TooltipComponent, CanvasRenderer]);

// 接收 `words` 数据
const props = defineProps({
  words: {
    type: Array,
    required: true
  }
});

let myChart: echarts.ECharts; // ECharts 实例

// 初始化词云图
const initChart = () => {
  const chartDom = document.getElementById('word-cloud'); // 获取 DOM 容器
  if (!chartDom) return;

  echarts.registerTheme('vintage', vintage); // 注册主题
  myChart = echarts.init(chartDom, 'vintage'); // 初始化 ECharts 实例

  updateChart(props.words); // 初次渲染
};

// 更新词云图数据
const updateChart = (words: any[]) => {
  // 限制最多 50 个高频词
  const filteredWords = words.sort((a, b) => b.value - a.value).slice(0, 50);

  const option = {
    tooltip: {
      show: true,
      formatter: (params: any) => `<b>${params.name}</b>: ${params.value}` // 鼠标悬停时显示词语和权重
    },
    series: [
      {
        type: 'wordCloud',
        shape: 'circle', 
        sizeRange: [20, 60], // 词大小范围
        gridSize: 10, // 词之间的间距
        rotationRange: [0, 0], 
        drawOutOfBound: false,
        textStyle: {
          fontFamily: 'STKaiti, KaiTi, serif', // 使用楷体
          fontWeight: 'bold',
          color: () => guFengColors[Math.floor(Math.random() * guFengColors.length)], // 配色
          shadowColor: 'rgba(0, 0, 0, 0.3)', // 添加阴影
          shadowBlur: 10,
        },
        data: filteredWords
      }
    ]
  };

  myChart.setOption(option); // 设置图表选项
};

// 组件挂载后初始化词云图
onMounted(initChart);

// 监听 `words` 数据变化，自动更新词云图
watch(() => props.words, updateChart, { deep: true });

// **古风配色方案**
const guFengColors = [
  '#8A5D19', // 棕褐色
  '#B35C44', // 朱红色
  '#406C64', // 青色
  '#C4A484', // 米色
  '#2E4E5B', // 墨绿色
  '#9D836B', // 古铜色
  '#695E45', // 土黄色
  '#A46F52', // 赭石色
  '#4D3D33', // 深棕色
];
</script>

<style scoped>
</style>
