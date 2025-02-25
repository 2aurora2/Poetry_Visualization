<template>
  <div ref="chartContainer" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import { TooltipComponent, VisualMapComponent, TitleComponent } from 'echarts/components'
import { MapChart, ScatterChart, EffectScatterChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import axios from 'axios'

// 注册必要的 ECharts 组件
echarts.use([
  TooltipComponent,
  VisualMapComponent,
  TitleComponent,
  MapChart,
  ScatterChart,
  EffectScatterChart,
  CanvasRenderer,
  LabelLayout
])

// 类型定义
interface MapItem {
  name: string
  value: number
}

interface GeoJson {
  type: string
  features: Array<{
    properties: {
      name: string
      center: [number, number]
      [key: string]: any
    }
    [key: string]: any
  }>
  [key: string]: any
}

// 配置项
const publicUrl = 'https://geo.datav.aliyun.com/areas_v2/bound/'
const tangData: MapItem[] = [
  { name: "河南省", value: 50 },
  // ...其他数据
]

const songData: MapItem[] = [
  { name: "陕西省", value: 30 },
  // ...其他数据
]

const yuanData: MapItem[] = [
  { name: "浙江省", value: 20 },
  // ...其他数据
]

// Vue 相关引用
const chartContainer = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 获取地理数据
async function getGeoJson(jsonName: string): Promise<GeoJson> {
  const response = await axios.get(`${publicUrl}${jsonName}`)
  return response.data
}

// 初始化图表
async function initChart() {
  if (!chartContainer.value) return

  chart = echarts.init(chartContainer.value)

  try {
    const [alladcode, chinaGeoJson] = await Promise.all([
      getGeoJson('all.json'),
      getGeoJson('100000_full.json')
    ])

    initEcharts(chinaGeoJson, '诗人籍贯分布演变', chart)
  } catch (error) {
    console.error('Failed to load geo data:', error)
  }
}

// ECharts 配置
function initEcharts(geoJson: GeoJson, name: string, chart: echarts.ECharts) {
  const geoCoordMap: Record<string, [number, number]> = {}

  geoJson.features.forEach(v => {
    const name = v.properties.name
    if (name) {
      geoCoordMap[name] = v.properties.center
    }
  })

  echarts.registerMap(name, geoJson as any)

  const convertData = (data: MapItem[]) => {
    return data.map(item => {
      const coord = geoCoordMap[item.name]
      return coord ? { name: item.name, value: coord.concat(item.value) } : null
    }).filter(item => item !== null)
  }

  const option: echarts.EChartsCoreOption = {
    title: {
      text: name,
      left: 'center',
      top: '4%',
      textStyle: {
        fontFamily: 'GlobalFont',
        fontSize: 25,
      }
    },
    tooltip: {
      triggerOn: "mousemove",
      formatter: (params: any) => {
        const value = isNaN(params.value) ? 0 : params.value
        return `<span>${params.name}：</span><br/><span>值：${value}</span>`
      },
      backgroundColor: 'rgba(29, 38, 71)',
      extraCssText: 'box-shadow:0 0 4px rgba(11, 19, 43,0.8)',
    },
    geo: {
      show: true,
      top: '10%',
      map: name,
      label: {
        show: false,
        emphasis: {
          show: true,
          color: "#31322c",
        }
      },
      roam: false,
      itemStyle: {
        areaColor: '#fff',
        borderColor: '#686a67',
        emphasis: {
          areaColor: '#00828B',
        }
      },
    },
    series: [
      {
        name: '唐',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: convertData(tangData),
        symbolSize: (val: any) => val[2] / 5,
        itemStyle: {
          color: 'red'
        },
        rippleEffect: {
          scale: 2.5,
          brushType: 'stroke'
        }
      },
      {
        name: '宋',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: convertData(songData),
        symbolSize: (val: any) => val[2] / 5,
        itemStyle: {
          color: 'blue'
        },
        rippleEffect: {
          scale: 2.5,
          brushType: 'stroke'
        }
      },
      {
        name: '元',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: convertData(yuanData),
        symbolSize: (val: any) => val[2] / 5,
        itemStyle: {
          color: 'green'
        },
        rippleEffect: {
          scale: 2.5,
          brushType: 'stroke'
        }
      }
    ],
    legend: {
      data: ['唐', '宋', '元'],
      bottom: '5%',
      right: '5%',
      textStyle: {
        fontSize: 16,
        color: '#333'
      },
      selected: {
        '唐': true,
        '宋': true,
        '元': true
      }
    },
  }

  chart.setOption(option)

  // 响应式调整
  const resizeHandler = () => chart?.resize()
  window.addEventListener('resize', resizeHandler)

  // 清理事件监听
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
  width: 100%;
  height: 600px;
}
</style>