<template>
    <div id="relation-graph" style="width: 1000px;height: 600px;"></div>
</template>

<script setup lang='ts'>
// RelationGraphComp：关系图谱组件
// 从官网直接复制按需引入组件
import * as echarts from 'echarts/core';
import {
    ToolboxComponent,
    TooltipComponent,
    type TooltipComponentOption,
    LegendComponent,
    type LegendComponentOption
} from 'echarts/components';
import { GraphChart, type GraphSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
    ToolboxComponent,
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

import type { GraphEdgeItemOption } from 'echarts/types/src/chart/graph/GraphSeries.js';

// 获取传入的参数：nodes和links
const props = defineProps({
    nodes: {
        type: Array,
        required: true,
    },
    links: {
        type: Array,
        required: true,
    },
})
const base_size = 15;
const incre_size = 20;

const processData = (nodes: Array<any>) => {
    let new_nodes = [];
    // 只筛选度数较高的节点
    const filteredNodes = [...nodes]
        .sort((a, b) => b.degree - a.degree)
        .slice(0, 150);
    // 求出filteredNodes中degree的最大值
    let max_degree = 0;
    for (let idx = 0; idx < filteredNodes.length; idx++) {
        if (filteredNodes[idx].degree > max_degree) {
            max_degree = filteredNodes[idx].degree;
        }
    }
    for (let idx = 0; idx < filteredNodes.length; idx++) {
        let new_node = {
            id: filteredNodes[idx].name,
            name: filteredNodes[idx].name,
            // TODO: 后续利用社区发现算法进行分类，读取category字段
            category: Math.floor(Math.random() * 5),
            // 利用node的degree字段对节点大小进行缩放
            symbolSize: base_size + filteredNodes[idx].degree * incre_size / max_degree
        }
        new_nodes.push(new_node);
    }
    return new_nodes;
}

onMounted(() => {
    let nodes = processData(props.nodes);
    // TODO: 后续利用社区发现算法进行分类后再修改
    let categories = [{ name: '1' }, { name: '2' }, { name: '3' }, { name: '4' }, { name: '5' }];

    var chartDom = document.getElementById('relation-graph')!;  // 获取容器 DOM 实例
    let themeObj = JSON.parse(JSON.stringify(vintage))  // 获取主题对象
    echarts.registerTheme('vintage', themeObj)   // 注册主题
    var myChart = echarts.init(chartDom, 'vintage');    // 初始化图表，传入主题名称

    // 边界渐变化
    myChart.on('rendered', () => {
        const canvas = myChart.getDom().querySelector('canvas');
        canvas!.style.maskImage = `
        linear-gradient(
        to right,
        transparent 10%,
        white 20% 80%,
        transparent 90%
        )
    `;
    });
    var option: EChartsOption;

    option = {
        tooltip: {},
        toolbox: {  // 工具栏，具体配置项参考：https://echarts.apache.org/zh/option.html#toolbox.feature
            show: true,
            feature: {
                saveAsImage: {
                    show: true,
                    title: '保存为png',
                    type: 'png'
                },
                restore: {
                    title: '重置'
                }
            }
        },
        series: [
            {
                name: 'Relation Graph',
                type: 'graph',
                layout: 'circular', // circular环形布局，force力引导布局
                circular: { // 环形布局配置
                    rotateLabel: true // 旋转标签
                },
                // force: { // 力引导布局配置
                //     repulsion: 400, // 增大斥力减少重叠
                //     edgeLength: [300, 600],
                //     layoutAnimation: false, // 关闭布局动画
                //     friction: 0.8,         // 增加摩擦系数加快稳定
                // },
                data: nodes,
                // @ts-ignore
                links: props.links,
                categories: categories,
                roam: true,
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                },
                draggable: true,    // 节点是否可拖拽
                focusNodeAdjacency: true,   // 鼠标悬停时是否高亮相邻节点和边
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
                },
                tooltip: {
                    formatter: function (params) {
                        // params.data 是当前节点的数据对象
                        // TODO: 展示节点的相关信息
                        // @ts-ignore
                        return `${params.data.name}`;
                    }
                }
            }
        ]
    };
    option && myChart.setOption(option);
})
</script>

<style scope lang="scss">
</style>