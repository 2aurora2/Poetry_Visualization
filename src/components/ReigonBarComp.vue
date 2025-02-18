<template>
    <div id="region-bar"></div>
</template>

<script setup lang='ts'>
// @ts-nocheck
import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent, DataZoomComponent, TitleComponent  } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, BarChart, CanvasRenderer, TooltipComponent, DataZoomComponent, TitleComponent]);

import { onMounted, watch, shallowRef, nextTick } from "vue";
import vintage from '@/assets/theme/vintage.json'

const props = defineProps({
    info: {
        type: Array,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    regionName: {
        type: Array,
        required: true,
    },
    regionValue: {
        type: Array,
        required: true,
    }
})
const graph = shallowRef();

const initEcharts = () => {
    if (graph.value) {
        graph.value.dispose();
    }
    var chartDom = document.getElementById('region-bar')!;  // 获取容器 DOM 实例
    chartDom.style.width = '100%';
    chartDom.style.height = '40vh';
    let themeObj = JSON.parse(JSON.stringify(vintage))  // 获取主题对象
    echarts.registerTheme('vintage', themeObj)   // 注册主题
    graph.value = echarts.init(chartDom, 'vintage');    // 初始化图表，传入主题名称

    var option;

    option = {
        title:{
            text: '诗人籍贯地域分布',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            extraCssText: 'width: 210px; white-space: pre-wrap;',
            formatter: (params: any) => {
                const index = params[0].dataIndex;
                return `<strong>${params[0].name}</strong>：${props.info[index]}`;
            }
        },
        xAxis: {
            type: 'category',
            data: props.regionName,
        },
        yAxis: {
            type: 'value'
        },
        dataZoom: [{ type: 'inside', disabled: true }],
        series: [
            {
                data: props.regionValue,
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    };

    option && graph.value.setOption(option, { notMerge: true });
}

watch(() => [props.id, props.regionName, props.regionValue], initEcharts, { deep: true });

onMounted(async () => {
    await nextTick();
    initEcharts();
})
</script>

<style scope lang="scss"></style>