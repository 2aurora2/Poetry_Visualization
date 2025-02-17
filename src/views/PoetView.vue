<template>
    <div class="poet-view">
        <div class="summary">
            <div class="dynasty-choose">
                <button v-for="(dynasty, index) in dynasties" :key="index"
                    :class="['dynasty-button', { active: selectedDynasty === index }]" @click="selectDynasty(index)">
                    {{ dynasty }}
                </button>
            </div>
            <RegionBarComp :info="selectedRegionInfo" :id="selectedDynasty" :regionName="selectedRegionName"
                :regionValue="selectedRegionValue"></RegionBarComp>
        </div>
        <div class="poet-details">
            <div class="search-box">
                <input type="text" class="poet-search" placeholder="请输入诗人姓名" v-model="poetName">
                <el-button circle type="warning" :icon="Search"></el-button>
            </div>
            <PoetCardComp></PoetCardComp>
        </div>
    </div>
</template>

<script setup lang='ts'>
import tangRegion from '@/assets/data/tang/region.json'
import songRegion from '@/assets/data/song/region.json'
import yuanRegion from '@/assets/data/yuan/region.json'
import regionInfo from '@/assets/data/region_info.json'

import RegionBarComp from '@/components/ReigonBarComp.vue'

import { Search } from '@element-plus/icons-vue'

import { onMounted, ref } from 'vue'

const selectedDynasty = ref(0);
const dynasties = ['唐', '宋', '元'];
const selectedRegionName = ref([]);
const selectedRegionValue = ref([]);
const selectedRegionInfo = ref([]);

const preprocessRegion = (region: Object) => {
    let regionList = Object.entries(region).sort((a, b) => b[1] - a[1]);
    let regionName = [];
    let regionValue = [];
    let regionDesc = [];
    let tar = 16;
    for (let i = 0; i < regionList.length; i++) {
        if (regionInfo.hasOwnProperty(dynasties[selectedDynasty.value] + regionList[i][0])) {
            regionName.push(regionList[i][0]);
            regionValue.push(regionList[i][1]);
            regionDesc.push(regionInfo[dynasties[selectedDynasty.value] + regionList[i][0]]);
            tar--;
        }
        if (tar === 0) {
            break;
        }
    }
    return [regionName, regionValue, regionDesc];
}

const selectDynasty = (index: number) => {
    selectedDynasty.value = index;
    switch (index) {
        case 0:
            // @ts-ignore
            [selectedRegionName.value, selectedRegionValue.value, selectedRegionInfo.value] = preprocessRegion(tangRegion);
            break;
        case 1:
            // @ts-ignore
            [selectedRegionName.value, selectedRegionValue.value, selectedRegionInfo.value] = preprocessRegion(songRegion);
            break;
        case 2:
            // @ts-ignore
            [selectedRegionName.value, selectedRegionValue.value, selectedRegionInfo.value] = preprocessRegion(yuanRegion);
            break;
    }
}

const selectedSearchDynasty = ref('唐');
const poetName = ref('');

onMounted(() => {
    selectDynasty(0);
})
</script>

<style scope lang="scss">
.poet-view {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .summary {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .poet-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        .search-box {
            width: 90%;
            display: flex;
            flex-direction: row;

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
    }
}

.dynasty-choose {
    width: 100%;
    display: flex;
    gap: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 8px;

    .dynasty-button {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: rgba(60, 60, 60, 0.1);
        border: 2px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        color: #333;
        transition: all 0.3s ease;

        &:hover {
            background-color: rgba(60, 60, 60, 0.2);
        }
    }

    .active {
        background-color: #4CAF50;
        color: white;
        border-color: #4CAF50;
    }
}
</style>