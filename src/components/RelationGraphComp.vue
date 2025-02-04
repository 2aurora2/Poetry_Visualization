<template>
    <div id="relation-graph" style="width: 600px;height: 600px;"></div>
</template>

<script setup lang='ts'>
// RelationGraphComp：关系图谱组件
// 从官网直接复制按需引入组件
import * as echarts from 'echarts/core';
import {
    TooltipComponent,
    TooltipComponentOption,
    LegendComponent,
    LegendComponentOption
} from 'echarts/components';
import { GraphChart, GraphSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
    TooltipComponent,
    LegendComponent,
    GraphChart,
    CanvasRenderer,
    LabelLayout
]);

type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption | LegendComponentOption | GraphSeriesOption
>;

import { onMounted } from "vue";
import vintage from '../assets/theme/vintage.json'

import graph from '../assets/data/relation.json'

// 获取传入的参数：关系图谱的数据路径
const props = defineProps({
    source: {
        type: String,
        required: true
    }
})

onMounted(() => {
    var chartDom = document.getElementById('relation-graph')!;  // 获取容器 DOM 实例
    let themeObj = JSON.parse(JSON.stringify(vintage))  // 获取主题对象
    echarts.registerTheme('vintage', themeObj)   // 注册主题
    var myChart = echarts.init(chartDom, 'vintage');    // 初始化图表，传入主题名称
    var option: EChartsOption;

    // TODO：按照想法修改样式
    option = {
        tooltip: {},
        legend: [
            {
                data: graph.categories.map(function (a: { name: string }) {
                    return a.name;
                })
            }
        ],
        series: [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'none',
                data: graph.nodes,
                links: graph.links,
                categories: graph.categories,
                roam: true,
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                },
                focusNodeAdjacency: true,   // 鼠标悬停时高亮相邻节点和边
                labelLayout: {
                    hideOverlap: true
                },
                scaleLimit: {
                    min: 0.4,
                    max: 2
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.3
                }
            }
        ]
    };
    option && myChart.setOption(option);
})
</script>

<style scope lang="scss"></style>