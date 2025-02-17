<template>
    <div class="poet-card">
        <div class="avatar-info">
            <img :src="props.avatar" alt="avatar">
            <div class="info">
                <div class="name"><strong>姓名：</strong>{{ props.name }}</div>
                <div class="gender"><strong>性别：</strong>{{ props.gender }}</div>
                <div class="address"><strong>籍贯：</strong>{{ props.address }}</div>
                <div class="year"><strong>生卒年：</strong>{{ props.YearBirth + "-" + props.YearDeath }}</div>
                <div class="desc"><strong>简介：</strong>{{ props.desc }}</div>
            </div>
        </div>
        <el-carousel class="carousel" motion-blur>
            <el-carousel-item v-for="item, index in props.works" :key="index">
                <div class="content">
                    <p>{{ item['title'] || item['rhythmic'] }}</p>
                    <p v-html="item['title'] ? item['paragraphs'].join('</br>') : item['paragraphs'].join('')"></p>
                </div>
            </el-carousel-item>
        </el-carousel>
        <div class="charts">
            <div id="emotion-pie"></div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { defineProps, shallowRef, onMounted } from 'vue'
import vintage from '@/assets/theme/vintage.json'

import * as echarts from 'echarts/core';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout
]);

const props = defineProps({
    avatar: {
        type: String,
        required: true,
        default: 'https://b0.bdstatic.com/d66b85e5ce66b3b449e0e62a8de2713c.jpg@h_1280'
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
    works: {
        type: Array,
        required: true,
        default: () => [{
            paragraphs: [
                "半世为人，不曾教大人心困。",
                "虽是搽胭粉，只争不裹头巾，将那等不做人的婆娘恨。"
            ],
            title: "诈妮子调风月・仙吕/点绛唇",
        }, {
            paragraphs: [
                "气和玉烛，睿化著鸿明。",
                "缇管一阳生。",
                "郊禋盛礼燔柴毕，旋轸凤凰城。",
                "森罗仪卫振华缨。",
                "载路溢欢声。",
                "皇图大业超前古，垂象泰阶平。",
                "岁时丰衍，九土乐升平。",
                "睹寰海澄清。",
                "道高尧舜垂衣治，日月并文明。",
                "嘉禾甘露登歌荐，云物焕祥经。",
                "兢兢惕惕持谦德，未许禅云亭。"
            ],
            rhythmic: "导引",
        }]
    },
    desc: {
        type: String,
        required: true,
        default: "一位神秘的诗人一位神秘的诗人一位神秘的诗人一位神秘的诗人一位神秘的诗人一位神秘的诗人一位神秘的诗人一位神秘的诗人一位神秘的诗人"
    },
    emotions: {
        type: Array,
        required: true,
        default: () =>
            [
                {
                    "name": "悲",
                    "value": 15579
                },
                {
                    "name": "思",
                    "value": 14211
                },
                {
                    "name": "乐",
                    "value": 11589
                },
                {
                    "name": "喜",
                    "value": 7594
                },
                {
                    "name": "忧",
                    "value": 4984
                },
                {
                    "name": "怒",
                    "value": 2674
                },
                {
                    "name": "惧",
                    "value": 716
                }
            ]
    }
})

const pieGraph = shallowRef();
const initPie = () => {
    if (pieGraph.value) {
        pieGraph.value.dispose();
    }
    var chartDom = document.getElementById('emotion-pie')!;  // 获取容器 DOM 实例
    chartDom.style.width = '40%';
    chartDom.style.height = '100%';
    let themeObj = JSON.parse(JSON.stringify(vintage))  // 获取主题对象
    echarts.registerTheme('vintage', themeObj)   // 注册主题
    pieGraph.value = echarts.init(chartDom, 'vintage');    // 初始化图表，传入主题名称

    var option;

    option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            left: 'left',
            top: 'middle',
            orient: 'vertical',
        },
        series: [
            {
                name: '诗词情感类别分布',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
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
                data: props.emotions
            }
        ]
    };

    option && pieGraph.value.setOption(option, { notMerge: true });
}

onMounted(() => {
    initPie();
})
</script>

<style scope lang="scss">
.poet-card {
    width: 90%;
    display: flex;
    flex-direction: column;
    margin-top: 16px;

    .avatar-info {
        display: flex;
        flex-direction: row;

        img {
            width: auto;
            height: 25vh;
            border-radius: 50%;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
            cursor: pointer;
        }

        .info {
            margin-left: 32px;
            font-size: 18px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 8px
        }
    }

    .carousel {
        width: 100%;
        height: 25vh;
        margin-top: 8px;

        .el-carousel__container {
            height: 100%;
        }

        .el-carousel__item {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            background: rgba(166, 165, 165, 0.25);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.535);
            backdrop-filter: blur(5px);

            .content {
                width: 90%;
                height: 100%;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: center;

                p {
                    margin: 4px;
                }

                p:first-child {
                    font-size: 20px;
                    font-weight: bold;
                }
            }
        }
    }

    .charts {
        width: 100%;
        height: 25vh;
        margin-top: 8px;
    }
}
</style>