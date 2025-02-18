<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  words: {
    type: Array,
    required: true
  }
})

const chartRef = ref(null)
let chartInstance = null

const getRandomColor = () => {
  const colors = [
    "#f3a6a6", 
    "#b2c1ae", 
    "#eac09d", 
    "#84c1c9", 
    "#e6a493", 
    "#888a8e", 
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart(props.words)
}

const updateChart = (words) => {
  const currentWords = words.slice(0, 50)
  if (currentWords.length === 0) return

  const values = currentWords.map(item => item.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const symbolSizeRange = { min: 25, max: 60 }
  const fontSizeScale = 0.5
  const highlightScale = 1.3

  const filteredWords = currentWords.map(item => {
    // 计算气泡大小
    let symbolSize
    if (minValue === maxValue) {
      symbolSize = (symbolSizeRange.min + symbolSizeRange.max) / 2
    } else {
      symbolSize = 
        ((item.value - minValue) / (maxValue - minValue)) * 
        (symbolSizeRange.max - symbolSizeRange.min) + 
        symbolSizeRange.min
    }

    // 计算字体大小
    const normalFontSize = Math.round(symbolSize * fontSizeScale)
    
    return {
      name: item.name,
      value: item.value,
      symbolSize: symbolSize,
      label: {
        fontSize: normalFontSize,
        fontWeight: 'bold',
        fontFamily: 'KaiTi, STKaiti, serif'
      },
      itemStyle: {
        color: getRandomColor()
      },
      emphasis: {
        label: {
          fontSize: Math.round(normalFontSize * highlightScale)
        }
      }
    }
  })

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}次'
    },
    series: [{
      type: 'graph',
      layout: 'force',
      data: filteredWords,
      roam: false,
      draggable: true,
      label: {
        show: true,
        position: 'inside',
        formatter: '{b}',
        color: '#333',
        align: 'center',
        verticalAlign: 'middle'
      },
      force: {
        repulsion: 50,
        gravity: 0.2,
        edgeLength: 25,
        layoutAnimation: true
      },
      emphasis: {
        scale: true,
        itemStyle: {
          opacity: 1,
          shadowBlur: 20,
          shadowColor: 'rgba(0,0,0,0.5)'
        },
        label: {
          fontWeight: 'bold'
        }
      }
    }]
  }

  chartInstance.setOption(option)
}

watch(() => props.words, (newWords) => {
  if (chartInstance) {
    updateChart(newWords)
  }
}, { deep: true })

onMounted(initChart)

</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
  max-width: 600px;
  max-height: 400px;
  margin: 0 auto;
}
</style>