<template>
  <div ref="chartContainer" style="width: 100%; height: 500px;"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import { TooltipComponent, GridComponent, LegendComponent, ToolboxComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import vintage from '@/assets/theme/vintage.json'; // 引入外部主题文件
import type { TooltipComponentOption, GridComponentOption, LegendComponentOption } from 'echarts/components';
import type { BarSeriesOption } from 'echarts/charts';

echarts.use([ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer]);

const chartContainer = ref<HTMLElement | null>(null);
const categories = ['唐代', '宋代', '元代'];
const totalPoems = [57347, 19484, 8771]; // 作品总量
const totalPoets = [3662, 1489, 230]; // 诗人总数

onMounted(() => {
  if (!chartContainer.value) return;
  const themeObj = JSON.parse(JSON.stringify(vintage)); // 获取主题对象
  echarts.registerTheme('vintage', themeObj); // 注册主题
  // 初始化图表并应用主题
  const chart = echarts.init(chartContainer.value, 'vintage');

  const option: echarts.ComposeOption<
    TooltipComponentOption | GridComponentOption | LegendComponentOption | BarSeriesOption
  > = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
      formatter: function (params: any) {
        let res = `${params[0].name}<br/>`;
        params.forEach((param: any) => {
          res += `${param.marker}${param.seriesName}: ${param.value}<br/>`;
        });
        return res;
      },
    },
    toolbox: {
      feature: {
        restore: { show: true, title: '重置' },
        saveAsImage: { show: true, title: '保存为 PNG' },
      },
    },
    legend: {
      data: ['作品总量', '诗人总数'],
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisPointer: {
        type: 'shadow',
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '作品总量',
        position: 'left',
        axisLabel: {
          formatter: '{value}',
        },
      },
      {
        type: 'value',
        name: '诗人总数',
        position: 'right',
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: [
      {
        name: '作品总量',
        type: 'bar',
        data: totalPoems,
        yAxisIndex: 0, // 绑定左侧 Y 轴
        itemStyle: {
          color: '#d87c7c', 
        },
        tooltip: {
          valueFormatter: function (value: number): string {
            return `${value} 首`;
          },
        },
      },
      {
        name: '诗人总数',
        type: 'bar',
        data: totalPoets,
        yAxisIndex: 1, // 绑定右侧 Y 轴
        itemStyle: {
          color: '#d7ab82', 
        },
        tooltip: {
          valueFormatter: function (value: number): string {
            return `${value} 位`;
          },
        },
      },
    ],
  };

  chart.setOption(option);
});
</script>

<style scoped></style>
