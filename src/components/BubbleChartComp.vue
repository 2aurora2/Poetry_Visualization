<template>
  <div id="bubble-chart"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  words: {
    type: Array,
    required: true
  }
})

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

const bubbleChart = shallowRef();
const initChart = () => {
  if (bubbleChart.value) {
    bubbleChart.value.dispose();
  }
  var chartDom = document.getElementById('bubble-chart')!;
  chartDom.style.width = '100%';
  chartDom.style.height = '100%';
  bubbleChart.value = echarts.init(chartDom);
  updateChart(props.words);
}

const updateChart = (words) => {
  const currentWords = words.slice(0, 70)
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
        color: getRandomColor(),
        opacity: 0.8 // 气泡透明度
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
    title: {
      text: '诗词单字气泡图',
      left: 'center',
      textStyle: {
        fontFamily: 'GlobalFont',
        fontSize: 25,
      }
    },
    series: [{
      type: 'graph',
      layout: 'force',
      data: filteredWords,
      roam: false, //禁止图表拖动
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
        gravity: 0.3,
        edgeLength: 30,
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

  bubbleChart.value.setOption(option)
}

watch(() => props.words, (newWords) => {
  initChart();
}, { deep: true })

onMounted(initChart)

</script>

<style scoped></style>