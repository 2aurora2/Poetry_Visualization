<template>
    <div id="emotion-pie" style="width: 600px;height: 250px;"></div>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts/core';
import { TitleComponent, ToolboxComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, PieChart, CanvasRenderer, LabelLayout, ToolboxComponent]);

import { onMounted } from 'vue';
import vintage from '@/assets/theme/vintage.json'

import tang_emotion from '@/assets/data/tang/emotion_count.json'
import song_emotion from '@/assets/data/song/emotion_count.json'
import yuan_emotion from '@/assets/data/yuan/emotion_count.json'

onMounted(() => {
    var chartDom = document.getElementById('emotion-pie')!;
    chartDom.style.width = '100%';
    chartDom.style.height = '100%';
    let themeObj = JSON.parse(JSON.stringify(vintage))  // 获取主题对象
    echarts.registerTheme('vintage', themeObj)   // 注册主题
    var myChart = echarts.init(chartDom, 'vintage');    // 初始化图表，传入主题名称
    var option;

    const tang = Array.from(tang_emotion);
    const song = Array.from(song_emotion);
    const yuan = Array.from(yuan_emotion);

    option = {
        toolbox: {  // 工具栏，具体配置项参考：https://echarts.apache.org/zh/option.html#toolbox.feature
            show: true,
            feature: {
                saveAsImage: {
                    show: true,
                    title: '保存为png',
                    type: 'png'
                }
            },
            orient: 'horizontal',
            left: 'right',
            top: 'top',
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            left: 'center',
            top: '90%',
            orient: 'horizontal',
        },
        title: [
            {
                text: '诗词情感分布比较',
                left: 'center',
                top: 'top',
            },
            {
                subtext: '唐诗',
                left: '18%',
                top: '75%',
                textAlign: 'center',
                subtextStyle: {
                    color: '#000000',
                    fontSize: 14,
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif'
                }
            },
            {
                subtext: '宋词',
                left: '49%',
                top: '75%',
                textAlign: 'center',
                subtextStyle: {
                    color: '#000000',
                    fontSize: 14,
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif'
                }
            },
            {
                subtext: '元曲',
                left: '79%',
                top: '75%',
                textAlign: 'center',
                subtextStyle: {
                    color: '#000000',
                    fontSize: 14,
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif'
                }
            }
        ],
        series: [
            {
                type: 'pie',
                // radius: '40%',
                radius: ['30%', '70%'],
                center: ['50%', '50%'],
                data: tang,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
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
                left: 0,
                right: '60%',
                top: 0,
                bottom: 0,
            },
            {
                type: 'pie',
                // radius: '40%',
                radius: ['30%', '70%'],
                center: ['50%', '50%'],
                data: song,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
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
                left: '30%',
                right: '30%',
                top: 0,
                bottom: 0,
            },
            {
                type: 'pie',
                // radius: '40%',
                radius: ['30%', '70%'],
                center: ['50%', '50%'],
                data: yuan,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
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
                left: '60%',
                right: 0,
                top: 0,
                bottom: 0,
            }
        ]
    };

    option && myChart.setOption(option);
})
</script>

<style scope lang="scss"></style>