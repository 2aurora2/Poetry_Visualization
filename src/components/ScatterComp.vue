<template>
    <div ref="scatterChart" style="width: 100%; height: 40%;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import vintage from '@/assets/theme/vintage.json';

const props = defineProps({
    selectedDynasty: {
        type: Number,
        required: true
    }
});

const scatterChart = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;
const dynasties = ['唐代', '宋代', '元代'];
echarts.registerTheme('vintage', vintage);

const loadDynastyData = async (dynasty: string) => {
    try {
        const data = await import(`../assets/data/${dynasty}/lifespan.json`);
        return data.default;
    } catch (error) {
        console.error('加载数据失败:', error);
        return [];
    }
};

const initChart = async () => {
    if (!scatterChart.value) return;
    const dynastyData = await loadDynastyData(['tang', 'song', 'yuan'][props.selectedDynasty]);
    chart = echarts.init(scatterChart.value, 'vintage'); 

    const option = {
        textStyle: {
            fontFamily: 'ContentFont',
            fontWeight: 'bold',
            fontSize: 16
        },
        title: {
            text: `${dynasties[props.selectedDynasty]}诗人享年数据分布`,
            textStyle: {
                fontFamily: 'TitleFont',
                fontSize: 25,
            },
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => `年龄: ${params.name}岁<br/>人数: ${params.value}人`
        },
        xAxis: {
            type: 'category',
            name: '年龄',
            nameLocation: 'middle',
            nameGap: 30,
            data: dynastyData.map((item: any) => item.name)
        },
        yAxis: {
            type: 'value',
            name: '人数',
            nameLocation: 'middle',
            nameGap: 40,
            axisLabel: { show: true } 
        },
        series: [{
            type: 'scatter',
            data: dynastyData.map((item: any) => item.value),
            symbolSize: (value: number) => Math.sqrt(value) * 6,
        }]
    };

    chart.setOption(option as echarts.EChartsOption);
};

watch(() => props.selectedDynasty, initChart);

const handleResize = () => chart?.resize();

onMounted(() => {
    initChart();
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    chart?.dispose();
    window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
</style>