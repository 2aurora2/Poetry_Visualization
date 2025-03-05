<template>
    <div id="pie"></div>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts/core';
import { TitleComponent, ToolboxComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, PieChart, CanvasRenderer, LabelLayout, ToolboxComponent, LegendComponent, TooltipComponent]);

import { onMounted, watch, shallowRef } from 'vue';
import vintage from '@/assets/theme/vintage.json';

const graph = shallowRef();

const props = defineProps({
    data: {
        type: Array,
        default: () => {
            return []
        }
    }
})

const initPie = () => {
    if (graph.value) {
        graph.value.dispose();
    }
    var chartDom = document.getElementById('pie')!;
    if(!chartDom)
        return;
    chartDom.style.width = '100%';
    chartDom.style.height = '100%';
    let themeObj = JSON.parse(JSON.stringify(vintage))  // 获取主题对象
    echarts.registerTheme('vintage', themeObj)   // 注册主题
    graph.value = echarts.init(chartDom, 'vintage');    // 初始化图表，传入主题名称
    var option;

    option = {
        // toolbox: {  // 工具栏，具体配置项参考：https://echarts.apache.org/zh/option.html#toolbox.feature
        //     show: true,
        //     feature: {
        //         saveAsImage: {
        //             show: true,
        //             title: '保存为png',
        //             type: 'png'
        //         }
        //     },
        //     orient: 'horizontal',
        //     left: 'right',
        //     top: 'top',
        // },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            left: 'center',
            top: '80%',
            orient: 'horizontal',
            textStyle: {
                fontFamily: 'ContentFont',
                fontSize: 20,
            }
        },
        label: {
            fontFamily: 'ContentFont'
        },
        series: [
            {
                name: '',
                type: 'pie',
                top: '-15%',
                radius: ['20%', '60%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: props.data,
                tooltip: {
                    textStyle: {
                        fontFamily: 'ContentFont',
                        fontSize: 20,
                    }
                }
            }
        ]
    };

    option && graph.value.setOption(option, { notMerge: true });
}

onMounted(() => {
    initPie();
})

watch(() => props.data, async () => {
    initPie();
})
</script>

<style scope lang="scss"></style>