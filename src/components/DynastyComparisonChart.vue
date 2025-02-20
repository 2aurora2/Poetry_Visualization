<template>
  <div ref="chartContainer" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import vintage from '@/assets/theme/vintage.json' // 引入主题 JSON

// 注册必要的 ECharts 组件
echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer])
// 注册主题
echarts.registerTheme('vintage', vintage)

const chartContainer = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function initChart() {
  if (!chartContainer.value) return

  // 使用主题初始化 ECharts 实例
  chart = echarts.init(chartContainer.value, 'vintage')

  const option: echarts.EChartsCoreOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['唐诗', '宋词', '元曲', '唐代诗人', '宋代诗人', '元代诗人']
    },
    series: [
      {
        name: '作品总量',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '36',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 57347, name: '唐诗' },
          { value: 19484, name: '宋词' },
          { value: 8771, name: '元曲' }
        ]
      },
      {
        name: '诗人占比',
        type: 'pie',
        radius: ['30%', '50%'],
        label: {
          show: false
        },
        data: [
          { value: 3662, name: '唐代诗人' },
          { value: 1489, name: '宋代诗人' },
          { value: 230, name: '元代诗人' }
        ]
      }
    ]
  }

  chart.setOption(option)

  const resizeHandler = () => chart?.resize()
  window.addEventListener('resize', resizeHandler)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
    chart?.dispose()
  })
}

onMounted(() => {
  initChart()
})
</script>

<style scoped>
.chart-container {
  width: 400px;
  height: 400px;
}
</style> 