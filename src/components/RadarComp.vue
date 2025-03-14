<template>
    <div id="radar"></div>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts/core';
import { TitleComponent, LegendComponent } from 'echarts/components';
import { RadarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer]);

import { onMounted, watch, shallowRef } from 'vue';
import vintage from '@/assets/theme/vintage.json';

const graph = shallowRef();

const props = defineProps({
    indicator: {
        type: Array,
        default: () => {
            return []
        }
    },
    value: {
        type: Array,
        default: () => {
            return []
        }
    }
})

const initRadar = () => {
    if (!props.value.length) {
        return;
    }

    if (graph.value) {
        graph.value.dispose();
    }
    var chartDom = document.getElementById('radar')!;
    chartDom.style.width = '100%';
    chartDom.style.height = '98%';
    let themeObj = JSON.parse(JSON.stringify(vintage))  // 获取主题对象
    echarts.registerTheme('vintage', themeObj)   // 注册主题
    graph.value = echarts.init(chartDom, 'vintage');    // 初始化图表，传入主题名称

    var option;

    option = {
        tooltip: {
            trigger: 'axis'
        },
        radar: {
            shape: 'circle',
            indicator: props.indicator,
            axisName: {
                color: '#000000',
                fontFamily: 'ContentFont',
                fontSize: 20,
                fontWeight: 'bold',
            },

            splitArea: {
                areaStyle: {
                    color: ['transparent', '#e6a23c55']
                }
            }
        },

        series: [
            {
                name: '情感雷达图',
                type: 'radar',
                tooltip: {
                    trigger: 'item',
                    textStyle: {
                        fontFamily: 'ContentFont',
                        fontSize: 18
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 3
                    }
                },
                areaStyle: {},
                data: [
                    {
                        value: props.value,
                    }
                ]
            }
        ]
    };

    option && graph.value.setOption(option, { notMerge: true });
}

onMounted(() => {
    initRadar();
})

watch(() => props.value, async () => {
    initRadar();
})
</script>

<style scope lang="scss"></style>