<template>
  <div ref="barChart" style="width: 100%; height: 40%;"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts/core';
import { TooltipComponent, GridComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer, TitleComponent]);

const barChart = ref(null);
const categories = ['唐代', '宋代', '元代'];
const totalPoems = [57347, 19484, 8771];

const defaultColor = '#919e8b'; // 默认颜色
const highlightColor = '#d87c7c'; // 高亮颜色

const props = defineProps({
  selectedDynasty: {
    type: Number,
    default: null,
  }
});
let chart = null;

onMounted(() => {
  if (!barChart.value) return;
  chart = echarts.init(barChart.value);
  renderChart();
});

watch(
  () => props.selectedDynasty,
  () => {
    renderChart();
  }
);

const renderChart = () => {
  const series = [
    {
      name: '诗词总量',
      type: 'bar',
      data: totalPoems.map((value, index) => ({
        value,
        itemStyle: {
          color: props.selectedDynasty === index ? highlightColor : defaultColor,
        },
      })),
    },
  ];

  chart.setOption({
    grid: { // 新增 grid 配置
      left: '2%',   // 增加左边距
      right: '12%',
      containLabel: true
    },
    title: {
      text: '诗词总量柱状图',
      textStyle: {
        fontFamily: 'TitleFont',
        fontSize: 25,
      },
      left: 'center',
    },
    textStyle: {
      fontFamily: 'ContentFont',
      fontWeight: 'bold',
      fontSize: 18,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      textStyle: {
        fontFamily: 'ContentFont',
        fontSize: 18,
        fontWeight: 'bold',
      },
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        fontFamily: 'ContentFont',
        fontSize: 18,
        fontWeight: 'bold',
      },
      axisPointer: {
        type: 'shadow',
        label: {
          show: true,
          backgroundColor: '#a6917e',
          color: '#FFFFFF',
          padding: [3, 5],
          borderRadius: 3,
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value) => `${(value / 10000).toFixed(1)}w`, // 转换为万单位
        fontFamily: 'ContentFont',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    series,
  });
};
</script>

<style scoped></style>