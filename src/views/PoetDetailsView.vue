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
            111
        </div>
    </div>
</template>

<script setup lang='ts'>
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

const poetName = ref('李白');
const poetInfo = ref<IPoet>(CONST.DEFAULT_POET);
const poetEmotionIndicator = ref<Array<any>>([]);
const poetEmotionValue = ref<Array<any>>([]);
const poetImagery = ref<Array<any>>([]);
const queryPoet = () => {
    poetEmotionIndicator.value = [];
    poetEmotionValue.value = [];
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
    }
    else if (yuanPoets.includes(poetName.value)) {
        poetInfo.value = yuanPoetInfo[poetName.value];
        if (Object.keys(yuanPoetEmotion).includes(poetName.value)) {   // 诗人诗词情感信息
            let emotion = yuanPoetEmotion[poetName.value]['emotion'];
            let maxVal = Math.max(...emotion.map((item: any) => item['value']));
            console.log(poetEmotionIndicator.value);

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
    align-items: center;
    justify-content: center;

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

                .chart-title {
                    font-family: 'ContentFont';
                    font-size: 25px;
                    text-align: center;
                    font-weight: 800;
                    margin-bottom: 4px;
                }
            }

            .emotion {
                flex: 1;
                height: 100%;

                .chart-title {
                    font-family: 'ContentFont';
                    font-size: 25px;
                    text-align: center;
                    font-weight: 800;
                    margin-bottom: 4px;
                }
            }
        }
    }

    .right {
        width: 45%;
        height: 100%;
    }
}
</style>