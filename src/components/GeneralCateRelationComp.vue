<template>
    <div id="general-cate-relation-bar" style="width: 600px;height: 300px;"></div>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts/core';
import {
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from 'echarts/components';
import { BarChart, LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    BarChart,
    LineChart,
    CanvasRenderer,
    UniversalTransition
]);

import { onMounted } from 'vue';
import vintage from '@/assets/theme/vintage.json'

const props = defineProps({
    width: {
        type: Number,
        required: true,
    }
});

onMounted(() => {
    var chartDom = document.getElementById('general-cate-relation-bar');
    chartDom.style.width = (props.width * 0.8) + 'px';
    chartDom.style.height = ((props.width * 0.7) / 2) + 'px';
    let themeObj = JSON.parse(JSON.stringify(vintage))  // 获取主题对象
    echarts.registerTheme('vintage', themeObj)   // 注册主题
    var myChart = echarts.init(chartDom, 'vintage');    // 初始化图表，传入主题名称
    var option;

    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            feature: {
                magicType: { show: true, type: ['line', 'bar'], title: { line: '折线图', bar: '柱状图' } },
                restore: { show: true, title: '重置' },
                saveAsImage: { show: true, title: '保存为png' }
            }
        },
        legend: {
            data: ['唐', '宋', '元']
        },
        xAxis: [
            {
                type: 'category',
                data: ['政治关系', '学术关系', '军事关系', '社会关系', '家庭关系'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '数量',
                min: 0,
                // max: 250,
                interval: 1000,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: '唐',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return value;
                    }
                },
                data: [33, 99, 0, 3715, 526]
            },
            {
                name: '宋',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return value;
                    }
                },
                data: [130, 3311, 4, 3368, 205]
            },
            {
                name: '元',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return value;
                    }
                },
                data: [0, 63, 0, 103, 2]
            }
        ]
    };

    option && myChart.setOption(option);
})
</script>

<style scope lang="scss"></style>