<template>
  <div ref="chartContainer" style="width: 100%; height: 500px;"></div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,GridComponent,LegendComponent,ToolboxComponent,
} from 'echarts/components';
import { BarChart, LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  ToolboxComponent,TooltipComponent,GridComponent,LegendComponent,BarChart,LineChart,CanvasRenderer,
]);

export default {
  name: 'PoetryDataChart',
  setup() {
    const chartContainer = ref(null);

    const categories = ['唐代', '宋代', '元代'];
    const totalPoems = [57347, 19484, 8771];
    const totalPoets = [3662, 1489, 230];

    onMounted(() => {
      const chart = echarts.init(chartContainer.value);

      const option: echarts.ComposeOption<
        TooltipComponentOption | GridComponentOption | LegendComponentOption | BarSeriesOption | LineSeriesOption
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
            magicType: {
              show: true,
              type: ['line', 'bar'],
              title: {
                line: '折线图', 
                bar: '柱状图', 
              },
            }, 
            restore: { show: true, title: '重置' }, 
            saveAsImage: { show: true, title: '保存为png' }, 
          },
        },
        legend: {
          data: ['作品总量', '诗人总数'],
        },
        xAxis: [
          {
            type: 'category',
            data: categories,
            axisPointer: {
              type: 'shadow',
            },
          },
        ],
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
            tooltip: {
              valueFormatter: function (value: number) {
                return `${value} 首`;
              },
            },
          },
          {
            name: '诗人总数',
            type: 'line',
            yAxisIndex: 1,
            data: totalPoets,
            tooltip: {
              valueFormatter: function (value: number) {
                return `${value} 位`;
              },
            },
            smooth: true,
          },
        ],
      };

      chart.setOption(option);
    });

    return {
      chartContainer,
    };
  },
};
</script>

<style scope lang="scss"></style>
