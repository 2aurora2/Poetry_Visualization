<template>
    <div id="sankey"></div>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import { SankeyChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, TooltipComponent, SankeyChart, CanvasRenderer]);

import { onMounted, watch, shallowRef, nextTick } from "vue";
import vintage from '@/assets/theme/vintage.json'
import infographic from '@/assets/theme/infographic.json'

const props = defineProps({
    nodes: {
        type: Array,
        required: true,
        default: () => [],
    },
    links: {
        type: Array,
        required: true,
        default: () => [],
    },
})

const graph = shallowRef();

const initEcharts = () => {
    if (graph.value) {
        graph.value.dispose();
    }
    var chartDom = document.getElementById('sankey')!;  // 获取容器 DOM 实例
    chartDom.style.width = '100%';
    chartDom.style.height = '42vh';
    let themeObj = JSON.parse(JSON.stringify(vintage))  // 获取主题对象
    echarts.registerTheme('vintage', themeObj)   // 注册主题
    graph.value = echarts.init(chartDom, 'vintage');    // 初始化图表，传入主题名称

    var option;

    option = {
        title: {
            text: '诗人情感派系桑基图',
            left: 'center',
            textStyle: {
                fontFamily: 'GlobalFont',
                fontSize: 25,
            }
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        toolbox: {  // 工具栏，具体配置项参考：https://echarts.apache.org/zh/option.html#toolbox.feature
            show: true,
            feature: {
                restore: {
                    title: '重置'
                }
            },
            orient: 'horizontal',
            left: 'right',
            top: 'top',
        },
        label:{
            textBorderWidth: -100
        },
        series: [
            {
                type: 'sankey',
                data: props.nodes,
                links: props.links,
                top: '10%',
                left: '13%',
                right: '13%',
                emphasis: {
                    focus: 'adjacency'
                },
                lineStyle: {
                    curveness: 0.5,
                    opacity: 0.07
                },
                emphasis: {
                    disabled: false,
                    lineStyle: {
                        opacity: 0.15
                    }
                },
            }
        ]
    };

    option && graph.value.setOption(option, { notMerge: true });
}

watch(() => [props.nodes], initEcharts, { deep: true });

onMounted(async () => {
    await nextTick();
    initEcharts();
})
</script>

<style scope lang="scss"></style>