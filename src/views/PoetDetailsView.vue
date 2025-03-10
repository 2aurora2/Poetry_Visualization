<template>
    <div class="poet-details">
        <div class="left">
            <div class="search-box">
                <input type="text" class="poet-search" placeholder="请输入诗人姓名" v-model="poetName"
                    @keypress.enter="queryPoet">
                <el-button circle type="warning" :icon="Search" @click="queryPoet"></el-button>
            </div>
            <PoetCardComp :avatar="poetInfo?.avatar" :name="poetInfo?.ChineseName" :gender="poetInfo?.Gender"
                :address="poetInfo?.Address" :YearBirth="poetInfo?.YearBirth" :YearDeath="poetInfo?.YearDeath"
                :desc="poetInfo?.desc" />
            <div class="imagery-emotion">
                <div class="imagery">
                    <div class="chart-title">诗词意象占比图</div>
                    <PieComp :data="poetImagery" />
                </div>
                <div class="emotion">
                    <div class="chart-title">诗词情感分布雷达图</div>
                    <RadarComp :indicator="poetEmotionIndicator" :value="poetEmotionValue" />
                </div>
            </div>
        </div>
        <div class="right">
            <div class="chart-title">{{ poetName }}的“社交圈”</div>
            <PersonalNetworkComp :nodes="poetNodes" :links="poetLinks" />
        </div>
    </div>
</template>

<script setup lang='ts'>
// @ts-nocheck
import PoetCardComp from '@/components/PoetCardComp.vue'
import RadarComp from '@/components/RadarComp.vue'

import tangLink from '@/assets/data/tang/links_with_name.json'
import songLink from '@/assets/data/song/links_with_name.json'
import yuanLink from '@/assets/data/yuan/links_with_name.json'

import tangPoetInfo from '@/assets/data/tang/poet_basic_info.json'
import songPoetInfo from '@/assets/data/song/poet_basic_info.json'
import yuanPoetInfo from '@/assets/data/yuan/poet_basic_info.json'

import tangPoetEmotion from '@/assets/data/tang/emotion_poet.json'
import songPoetEmotion from '@/assets/data/song/emotion_poet.json'
import yuanPoetEmotion from '@/assets/data/yuan/emotion_poet.json'

import tangImagery from '@/assets/data/tang/imagery.json'
import songImagery from '@/assets/data/song/imagery.json'
import yuanImagery from '@/assets/data/yuan/imagery.json'

import { Search } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import type { ILink, INode, IPoet } from '../interface/poet'
import CONST from '../const'

let tangPoets = Object.keys(tangPoetInfo);
let songPoets = Object.keys(songPoetInfo);
let yuanPoets = Object.keys(yuanPoetInfo);

const poetName = ref('孟浩然');
const poetInfo = ref<IPoet>(CONST.DEFAULT_POET);
const poetEmotionIndicator = ref<Array<any>>([]);
const poetEmotionValue = ref<Array<any>>([]);
const poetImagery = ref<Array<any>>([]);
const poetNodes = ref<Array<INode>>([]);
const poetLinks = ref<Array<ILink>>([]);

const preprocessNetworkData = (info: Array) => {
    let tempNodes = new Set();
    tempNodes.add(poetName.value);
    for (let i = 0; i < info.length; i++) {
        if (info[i]['source'] === poetName.value && info[i]['target'] !== poetName.value) {
            tempNodes.add(info[i]['target']);
            let flag = false;
            for (let j = 0; j < poetLinks.value.length; j++) {
                if (poetLinks.value[j]['source'] === poetName.value && poetLinks.value[j]['target'] === info[i]['target']) {
                    flag = true;
                    poetLinks.value[j]['name'].push(info[i]['name']);
                    break;
                }
            }
            if (!flag) {
                poetLinks.value.push({
                    source: poetName.value,
                    target: info[i]['target'],
                    name: [info[i]['name']]
                })
            }
        }
    }
    for (let node of tempNodes) {
        poetNodes.value.push({
            name: node,
            isCenter: node === poetName.value
        })
    }
    // 对于非poetName的节点，看看是否有边的两个节点是位于tempNodes的节点，有则将边加入poetLinks
    for (let i = 0; i < info.length; i++) {
        if (info[i]['source'] !== poetName.value && info[i]['target'] !== poetName.value) {
            if (tempNodes.has(info[i]['source']) && tempNodes.has(info[i]['target'])) {
                let flag = false;
                for (let j = 0; j < poetLinks.value.length; j++) {
                    if (poetLinks.value[j]['source'] === info[i]['source'] && poetLinks.value[j]['target'] === info[i]['target']) {
                        flag = true;
                        poetLinks.value[j]['name'].push(info[i]['name']);
                        break;
                    }
                }
                if (!flag) {
                    poetLinks.value.push({
                        source: info[i]['source'],
                        target: info[i]['target'],
                        name: [info[i]['name']],
                        lineStyle: {
                            width: Math.random() * 2 + 0.1,
                            opacity: Math.random() * 0.5 + 0.01
                        }
                    })
                }
            }
        }
    }
}

const queryPoet = () => {
    poetEmotionIndicator.value = [];
    poetEmotionValue.value = [];
    poetNodes.value = [];
    poetLinks.value = [];
    if (poetName.value.length === 0) {
        // @ts-ignore
        ElMessage.warning('请输入诗人姓名');
        return;
    }
    if (tangPoets.includes(poetName.value)) {
        poetInfo.value = tangPoetInfo[poetName.value];  // 诗人基本信息
        if (Object.keys(tangPoetEmotion).includes(poetName.value)) {   // 诗人诗词情感信息
            let emotion = tangPoetEmotion[poetName.value]['emotion'];
            let maxVal = Math.max(...emotion.map((item: any) => item['value']));
            for (let i = 0; i < emotion.length; i++) {
                poetEmotionIndicator.value.push({
                    name: emotion[i]['name'],
                    max: maxVal + 1
                });
                poetEmotionValue.value.push(emotion[i]['value']);
            }
        }
        if (Object.keys(tangImagery).includes(poetName.value)) { // 诗人诗词意象信息
            poetImagery.value = tangImagery[poetName.value];
        }
        preprocessNetworkData(tangLink);
    }
    else if (songPoets.includes(poetName.value)) {
        poetInfo.value = songPoetInfo[poetName.value];
        if (Object.keys(songPoetEmotion).includes(poetName.value)) {   // 诗人诗词情感信息
            let emotion = songPoetEmotion[poetName.value]['emotion'];
            let maxVal = Math.max(...emotion.map((item: any) => item['value']));
            for (let i = 0; i < emotion.length; i++) {
                poetEmotionIndicator.value.push({
                    text: emotion[i]['name'],
                    max: maxVal + 1
                });
                poetEmotionValue.value.push(emotion[i]['value']);
            }
        }
        if (Object.keys(songImagery).includes(poetName.value)) { // 诗人诗词意象信息
            poetImagery.value = songImagery[poetName.value];
        }
        preprocessNetworkData(songLink);
    }
    else if (yuanPoets.includes(poetName.value)) {
        poetInfo.value = yuanPoetInfo[poetName.value];
        if (Object.keys(yuanPoetEmotion).includes(poetName.value)) {   // 诗人诗词情感信息
            let emotion = yuanPoetEmotion[poetName.value]['emotion'];
            let maxVal = Math.max(...emotion.map((item: any) => item['value']));

            for (let i = 0; i < emotion.length; i++) {
                poetEmotionIndicator.value.push({
                    name: emotion[i]['name'],
                    value: maxVal + 1
                });
                poetEmotionValue.value.push(emotion[i]['value']);
            }
        }
        if (Object.keys(yuanImagery).includes(poetName.value)) { // 诗人诗词意象信息
            poetImagery.value = yuanImagery[poetName.value];
        }
        preprocessNetworkData(yuanLink);
    }
}

onMounted(() => {
    queryPoet();
})
</script>

<style scope lang="scss">
.poet-details {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 8px;

    .left {
        width: 55%;
        height: 95%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .search-box {
            width: 95%;
            display: flex;
            flex-direction: row;
            align-items: center;

            input {
                font-family: 'ContentFont';
                font-size: 18px;
            }

            .poet-search {
                flex: 9;
                margin-right: 8px;
                border: 2px solid #ddb16f;
                border-radius: 8px;
                padding: 8px;
                background: transparent;

                &:focus {
                    outline: none;
                    border: 2px solid #ddb16f;
                }
            }

            .poet-search-button {
                flex: 1;
            }
        }

        .imagery-emotion {
            width: 95%;
            height: 45vh;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            .imagery {
                flex: 1.2;
                height: 100%;
            }

            .emotion {
                flex: 1;
                height: 100%;
            }
        }
    }

    .right {
        width: 45%;
        height: 95%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
}

.chart-title {
    font-family: 'TitleFont';
    font-size: 25px;
    text-align: center;
    font-weight: 600;
}
</style>