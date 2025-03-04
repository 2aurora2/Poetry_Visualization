<template>
    <div class="avatar-info">
        <img :src="props.avatar" alt="avatar">
        <div class="info">
            <div class="name"><strong>姓名：</strong>{{ props.name }}</div>
            <div class="gender"><strong>性别：</strong>{{ props.gender }}</div>
            <div class="address"><strong>籍贯：</strong>{{ props.address }}</div>
            <div class="year"><strong>生卒年：</strong>{{ props.YearBirth + "年 - " + props.YearDeath + "年" }}</div>
            <div class="desc"><strong>简介：</strong>{{ props.desc }}</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
// @ts-nocheck
import { defineProps, shallowRef, onMounted, nextTick, watch } from 'vue'
import vintage from '@/assets/theme/vintage.json'

import * as echarts from 'echarts/core';
import { TooltipComponent, LegendComponent, ToolboxComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { GraphChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { draggable } from 'element-plus/es/components/color-picker/src/utils/draggable.mjs';

echarts.use([
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout,
    GraphChart,
    ToolboxComponent
]);

const props = defineProps({
    avatar: {
        type: String,
        required: true,
        default: 'https://pic.rmb.bdstatic.com/bjh/240509/7f39f3e985978e480382b1f80f438e149853.jpeg'
    },
    name: {
        type: String,
        required: true,
        default: '佚名'
    },
    gender: {
        type: String,
        required: true,
        default: '不详'
    },
    address: {
        type: String,
        required: true,
        default: '不详'
    },
    YearBirth: {
        type: String,
        required: true,
        default: "0"
    },
    YearDeath: {
        type: String,
        required: true,
        default: "0"
    },
    desc: {
        type: String,
        required: true,
        default: ""
    }
})

const relationGraph = shallowRef();
const initRelationGraph = () => {
    if (relationGraph.value) {
        relationGraph.value.dispose();
    }
    var chartDom = document.getElementById('relation-graph')!;  // 获取容器 DOM 实例
    chartDom.style.width = '50%';
    chartDom.style.height = '100%';

    const containerWidth = chartDom.clientWidth;
    const containerHeight = chartDom.clientHeight;

    const nodes = props.nodes.map(node => {
        if (node.isCenter) {
            return {
                ...node,
                // x: containerWidth / 2,
                // y: containerHeight / 2,
                // fixed: true,
                symbolSize: 45
            };
        }
        else {
            return {
                ...node,
                symbolSize: 35
            }
        }
    });

    let themeObj = JSON.parse(JSON.stringify(vintage))  // 获取主题对象
    echarts.registerTheme('vintage', themeObj)   // 注册主题
    relationGraph.value = echarts.init(chartDom, 'vintage');    // 初始化图表，传入主题名称

    var option;

    option = {
        tooltip: {},
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
        label: {
            fontFamily: 'ContentFont',
            fontSize: 25,
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: 'force',
                force: {
                    repulsion: 40,     // 节点间斥力（值越大节点间距越大）
                    gravity: 0.1,      // 向心力（值越大节点越靠近中心）
                    edgeLength: [50, 180],     // 边的理想长度
                    friction: 0.1,      // 摩擦系数（控制动画速度）
                    layoutAnimation: true
                },
                autoCurveness: true,
                data: nodes,
                links: props.links,
                focusNodeAdjacency: true,
                label: {
                    show: true,
                    position: 'inside',
                    fontSize: 10,
                    LabelLayout: {
                        hideOverlap: true
                    }
                },
                roam: true,
                draggable: true,
                tooltip: {
                    formatter: function (params) {
                        if (params.dataType === 'node') {
                            return `<strong>${params.data.name}</strong>`;
                        } else if (params.dataType === 'edge') {
                            if (params.data.name.length === 1)
                                return `${params.data.name[0]}`;
                            let labelList = [];
                            for (let i = 0; i < params.data.name.length; i++) {
                                labelList.push('(' + (i + 1) + ') ' + params.data.name[i]);
                            }
                            return `${labelList.join('</br>')}`;
                        }
                        return '';
                    }
                }
            }
        ]
    };
    option && relationGraph.value.setOption(option);
}

onMounted(() => {
    // initRelationGraph();
})
</script>

<style scope lang="scss">
.avatar-info {
    width: 95%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 35vh;

    img {
        width: auto;
        height: 25vh;
        border-radius: 50%;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
        cursor: pointer;
    }

    .info {
        margin-left: 32px;
        font-size: 22px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 8px;
        font-family: 'ContentFont';
    }
}
</style>