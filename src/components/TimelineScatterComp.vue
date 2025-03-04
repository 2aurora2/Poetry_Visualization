<template>
    <div id="timeline-scatter" style="width: 85%;height: 160px;"></div>
</template>

<script setup lang='ts'>
// @ts-nocheck
import * as echarts from 'echarts/core';
import {
    TitleComponent,
    SingleAxisComponent,
    TooltipComponent
} from 'echarts/components';
import { ScatterChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
    TitleComponent,
    SingleAxisComponent,
    TooltipComponent,
    ScatterChart,
    CanvasRenderer,
    UniversalTransition
]);

import { onMounted } from 'vue';
import vintage from '@/assets/theme/vintage.json'

import timeline from '@/assets/data/timeline.json'

onMounted(() => {
    var chartDom = document.getElementById('timeline-scatter');
    let themeObj = JSON.parse(JSON.stringify(vintage))  // 获取主题对象
    echarts.registerTheme('vintage', themeObj)   // 注册主题
    var myChart = echarts.init(chartDom, 'vintage');    // 初始化图表，传入主题名称
    var option;

    const tangAxisData = Array.from({ length: timeline["唐"].end - timeline["唐"].begin + 1 }, (_, i) => i + timeline["唐"].begin);
    const songAxisData = Array.from({ length: timeline["宋"].end - timeline["宋"].begin + 1 }, (_, i) => i + timeline["宋"].begin);
    const yuanAxisData = Array.from({ length: timeline["元"].end - timeline["元"].begin + 1 }, (_, i) => i + timeline["元"].begin);

    const axisData = [tangAxisData, songAxisData, yuanAxisData];
    const dynasties = ["唐诗", "宋词", "元曲"]

    const data = []
    for (let i = 0; i < dynasties.length; i++) {
        const dynasty = dynasties[i].substring(0, 1);
        const times = timeline[dynasty]['timeline'];
        for (let j = 0; j < times.length; j++) {
            data.push([i, times[j]['year'], times[j]['count']]);
        }
    }
    const maxCount = data.reduce((acc, cur) => {
        if (acc[cur[0]]) {
            acc[cur[0]] = Math.max(acc[cur[0]], cur[2]);
        } else {
            acc[cur[0]] = cur[2];
        }
        return acc;
    }, []);

    // 关键时间节点
    const keyPoints = Array.from([
        Array.from([650, 718, 756, 793, 818]),
        Array.from([1126, 1185]),
        Array.from([1296, 1321])
    ]);
    const keyPointsSize = [1000, 200, 50]
    keyPoints.forEach((points, index) => {
        points.forEach((point) => {
            data.push([index, point, keyPointsSize[index]]);
        })
    })

    const title = [];
    const singleAxis = [];
    const series = [];
    dynasties.forEach((dynasty, index) => {
        title.push({
            textBaseline: 'middle',
            top: ((index + 0.5) * 100) / 3 + '%',
            text: dynasty,
            textStyle: {
                fontFamily: 'TitleFont',
                fontSize: 25,
            }
        });
        singleAxis.push({
            left: 70,
            type: 'value',
            boundaryGap: false,
            min: axisData[index][0],
            max: axisData[index][axisData[index].length - 1],
            top: (index * 100) / 3 + '%',
            height: 100 / 3 - 15 + '%',
            axisTick: {
                interval: 20,
            },
            axisLabel:{
                fontFamily: 'ContentFont',
            }
        });

        series.push({
            singleAxisIndex: index,
            coordinateSystem: 'singleAxis',
            type: 'scatter',
            data: [],
            symbol: (value, params) => {
                if (keyPoints[index].includes(value[0])) {
                    return 'arrow';
                }
                else {
                    return 'circle';
                }
            },
            symbolSize: function (val) {
                return 6 + val[1] / maxCount[index] * 25;
            },
            tooltip: {
                formatter: function (params) {
                    if (keyPoints[index].includes(params.data[0])) {
                        return `【KeyPoint：${params.data[0]}年】`
                    }
                    return `年份：${params.data[0]}<br/>创作数量：${params.data[1]}`
                },
            }
        });
    })
    data.forEach((item) => {
        series[item[0]].data.push([item[1], item[2]]);
    })
    option = {
        tooltip: {
            position: 'top',
            textStyle: {
                fontFamily: 'ContentFont',
                fontSize: 16,
            }
        },
        title: title,
        singleAxis: singleAxis,
        series: series
    };
    option && myChart.setOption(option);
})
</script>

<style scope lang="scss"></style>