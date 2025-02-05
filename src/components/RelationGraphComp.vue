<template>
    <div id="relation-graph" style="width: 800px;height: 600px;"></div>
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
    TitleComponent,
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
    LabelLayout,
    TitleComponent 
]);

type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption | LegendComponentOption | GraphSeriesOption
>;

import { onMounted } from "vue";
import vintage from '@/assets/theme/vintage.json'

// 节点列表nodes、关系列表links、图注title
const props = defineProps({
    nodes: {
        type: Array,
        required: true,
    },
    links: {
        type: Array,
        required: true,
    }
});

const baseSize = 15;
const increSize = 30;

const processData = (nodes: Array<any>) => {
    let newNodes = [];
    // 只筛选度数较高的节点
    const filteredNodes = [...nodes]
        .sort((a, b) => b.degree - a.degree)
        .slice(0, 200);
    // 求出filteredNodes中degree的最大值
    let maxDegree = 0;
    for (let idx = 0; idx < filteredNodes.length; idx++) {
        if (filteredNodes[idx].degree > maxDegree) {
            maxDegree = filteredNodes[idx].degree;
        }
    }
    for (let idx = 0; idx < filteredNodes.length; idx++) {
        let new_node = {
            id: filteredNodes[idx].name,
            name: filteredNodes[idx].name,
            category: filteredNodes[idx].community,
            // 利用node的degree字段对节点大小进行缩放
            symbolSize: baseSize + filteredNodes[idx].degree * increSize / maxDegree
        }
        newNodes.push(new_node);
    }
    return newNodes;
}

onMounted(() => {
    let nodes = processData(props.nodes);
    let categories = [];
    let categorySet = new Set<string>();
    for (let idx = 0; idx < nodes.length; idx++) {
        categorySet.add(nodes[idx].category);
    }
    for (const item of categorySet) {
        categories.push({
            name: item
        });
    }

    var chartDom = document.getElementById('relation-graph')!;  // 获取容器 DOM 实例
    let themeObj = JSON.parse(JSON.stringify(vintage))  // 获取主题对象
    echarts.registerTheme('vintage', themeObj)   // 注册主题
    var myChart = echarts.init(chartDom, 'vintage');    // 初始化图表，传入主题名称

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
            },
            orient: 'horizontal', 
            left: 'right',       
            top: 'top',          
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
                        if (params.dataType === 'node') {
                            // @ts-ignore
                            return `${params.data.name}`;
                        } else if (params.dataType === 'edge') {
                            // @ts-ignore
                            return `${params.data.source} → ${params.data.target}`;
                        }
                        return '';
                    }
                }
            }
        ]
    };
    option && myChart.setOption(option);
})
</script>

<style scope lang="scss"></style>