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

const props = defineProps({
    nodes: {
        type: Array,
        required: true,
        default: () => [
            { name: '喜', depth: 0 },
            { name: '怒', depth: 0 },
            { name: '哀', depth: 0 },
            { name: '乐', depth: 0 }, // 新增情感
            { name: '忧', depth: 0 }, // 新增情感
            { name: '爱', depth: 0 }, // 新增情感
            { name: '恨', depth: 0 }, // 新增情感
            { name: '诗人1', depth: 1 },
            { name: '诗人2', depth: 1 },
            { name: '诗人3', depth: 1 },
            { name: '诗人4', depth: 1 },
            { name: '诗人5', depth: 1 },
            { name: '诗人6', depth: 1 },
            { name: '诗人7', depth: 1 }, // 新增诗人
            { name: '诗人8', depth: 1 }, // 新增诗人
            { name: '诗人9', depth: 1 }, // 新增诗人
            { name: '诗人10', depth: 1 }, // 新增诗人
            { name: '诗人11', depth: 1 }, // 新增诗人
            { name: '诗人12', depth: 1 }, // 新增诗人
            { name: '诗人13', depth: 1 }, // 新增诗人
            { name: '诗人14', depth: 1 }, // 新增诗人
            { name: '诗人15', depth: 1 }, // 新增诗人
            { name: '派系1', depth: 2 },
            { name: '派系2', depth: 2 },
            { name: '派别A', depth: 2 }, // 新增派别
            { name: '派别B', depth: 2 }, // 新增派别
        ],
    },
    links: {
        type: Array,
        required: true,
        default: () => [
            { source: '喜', target: '诗人1', value: 0.2 },
            { source: '喜', target: '诗人2', value: 0.2 },
            { source: '喜', target: '诗人3', value: 0.2 },
            { source: '喜', target: '诗人4', value: 0.2 },
            { source: '喜', target: '诗人5', value: 0.2 },
            { source: '怒', target: '诗人6', value: 0.3 },
            { source: '怒', target: '诗人7', value: 0.3 },
            { source: '怒', target: '诗人8', value: 0.3 },
            { source: '怒', target: '诗人9', value: 0.3 },
            { source: '怒', target: '诗人10', value: 0.3 },
            { source: '哀', target: '诗人11', value: 0.4 },
            { source: '哀', target: '诗人12', value: 0.4 },
            { source: '哀', target: '诗人13', value: 0.4 },
            { source: '哀', target: '诗人14', value: 0.4 },
            { source: '乐', target: '诗人15', value: 0.5 }, // 新增链接
            { source: '乐', target: '诗人1', value: 0.5 },
            { source: '乐', target: '诗人2', value: 0.5 },
            { source: '忧', target: '诗人3', value: 0.6 }, // 新增链接
            { source: '忧', target: '诗人4', value: 0.6 },
            { source: '爱', target: '诗人5', value: 0.7 }, // 新增链接
            { source: '爱', target: '诗人6', value: 0.7 },
            { source: '恨', target: '诗人7', value: 0.8 }, // 新增链接
            { source: '恨', target: '诗人8', value: 0.8 },
            { source: '诗人1', target: '派系1', value: 0.2 },
            { source: '诗人2', target: '派系1', value: 0.2 },
            { source: '诗人3', target: '派系2', value: 0.2 },
            { source: '诗人4', target: '派系2', value: 0.1 },
            { source: '诗人5', target: '派别A', value: 0.3 }, // 新增链接
            { source: '诗人6', target: '派别A', value: 0.3 },
            { source: '诗人7', target: '派别B', value: 0.4 }, // 新增链接
            { source: '诗人8', target: '派别B', value: 0.4 },
            { source: '诗人9', target: '派系1', value: 0.5 },
            { source: '诗人10', target: '派系1', value: 0.5 },
            { source: '诗人11', target: '派系2', value: 0.6 },
            { source: '诗人12', target: '派系2', value: 0.6 },
            { source: '诗人13', target: '派别A', value: 0.7 },
            { source: '诗人14', target: '派别A', value: 0.7 },
            { source: '诗人15', target: '派别B', value: 0.8 },
        ],
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
        series: [
            {
                type: 'sankey',
                data: props.nodes,
                links: props.links,
                top: '10%',
                left: '10%', // 图表距离左侧的距离
                right: '10%', // 图表距离右侧的距离
                emphasis: {
                    focus: 'adjacency'
                },
                levels: [
                    {
                        depth: 0,
                        itemStyle: {
                            color: '#c97373'
                        },
                        lineStyle: {
                            color: 'source',
                            opacity: 0.5
                        }
                    },
                    {
                        depth: 1,
                        itemStyle: {
                            color: '#63a4ab'
                        },
                        lineStyle: {
                            color: 'source',
                            opacity: 0.5
                        }
                    },
                    {
                        depth: 2,
                        itemStyle: {
                            color: '#94a18d'
                        },
                        lineStyle: {
                            color: 'source',
                            opacity: 0.5
                        }
                    }
                ],
                lineStyle: {
                    curveness: 0.5
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