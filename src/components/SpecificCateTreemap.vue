<template>
    <div id="specific-cate-treemap"></div>
</template>

<script setup lang='ts'>
// @ts-nocheck
import * as echarts from 'echarts/core';
import { TreemapChart, SunburstChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TreemapChart, SunburstChart, CanvasRenderer, UniversalTransition]);

import { onMounted, shallowRef, watch, nextTick, onUnmounted } from 'vue';
import vintage from '@/assets/theme/vintage.json'

const props = defineProps({
    width: {
        type: Number,
        required: true,
    },
    data: {
        type: Array,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    }
});

const graph = shallowRef();
let timerId: number | null = null;

const initEcharts = async () => {
    await nextTick();

    if (graph.value) {
        graph.value.dispose();
    }
    var chartDom = document.getElementById('specific-cate-treemap');
    chartDom.style.width = '100%';
    chartDom.style.height = '100%';
    let themeObj = JSON.parse(JSON.stringify(vintage))  // 获取主题对象
    echarts.registerTheme('vintage', themeObj)   // 注册主题
    var myChart = echarts.init(chartDom, 'vintage');    // 初始化图表，传入主题名称

    const getLevelOption = () => {
        return [
            {
                itemStyle: {
                    borderColor: '#777',
                    borderWidth: 0,
                    gapWidth: 1
                },
                upperLabel: {
                    show: false
                }
            },
            {
                itemStyle: {
                    borderColor: '#555',
                    borderWidth: 5,
                    gapWidth: 1
                },
                emphasis: {
                    itemStyle: {
                        borderColor: '#ddd'
                    }
                }
            },
            {
                colorSaturation: [0.35, 0.5],
                itemStyle: {
                    borderWidth: 5,
                    gapWidth: 1,
                    borderColorSaturation: 0.6
                }
            }
        ];
    }

    const commonOption = {
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                if (params.componentSubType === 'treemap') {
                    return `${params.name}<br/>数值: ${params.value}`;
                }
                if (params.componentSubType === 'sunburst') {
                    const path = params.treePathInfo
                        ? params.treePathInfo.map(n => n.name).join(' → ')
                        : params.name;
                    return `${path}<br/>数值: ${params.value}`;
                }
            }
        },
        toolbox: {
            feature: {
                restore: { show: true, title: '重置' },
                saveAsImage: { show: true, title: '保存为png' }
            }
        },
    };

    const treemapOption = {
        ...commonOption,
        series: [
            {
                type: 'treemap',
                id: 'echarts-package-size',
                width: '100%',
                animationDurationUpdate: 1000,
                roam: false,
                nodeClick: undefined,
                data: props.data,
                universalTransition: true,
                breadcrumb: {
                    show: false
                },
                label: {
                    show: true,
                    formatter: '{b}'
                },
                upperLabel: {
                    show: true,
                    height: 30
                },
                levels: getLevelOption(),
            }
        ]
    };
    const sunburstOption = {
        series: [
            {
                type: 'sunburst',
                id: 'echarts-package-size',
                radius: ['20%', '90%'],
                animationDurationUpdate: 1000,
                nodeClick: 'rootToNode',
                data: props.data,
                universalTransition: true,
                itemStyle: {
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,.5)'
                },
                label: {
                    show: true,
                    rotate: 'radial',
                    formatter: '{b}',
                    minAngle: 5,
                }
            }
        ]
    };
    let currentOption = treemapOption;
    myChart.setOption(currentOption);

    if (timerId) {
        clearInterval(timerId);
    }

    timerId = setInterval(function () {
        currentOption = currentOption === treemapOption ? sunburstOption : treemapOption;
        myChart.setOption(currentOption);
    }, 10000);
}

watch(() => props.id, async () => {
    await nextTick();

    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }

    await initEcharts();
});

onMounted(async () => {
    await initEcharts();
});

onUnmounted(() => {
    if (timerId) {
        clearInterval(timerId);
    }
    if (graph.value) {
        graph.value.dispose();
    }
});
</script>

<style scope lang="scss"></style>