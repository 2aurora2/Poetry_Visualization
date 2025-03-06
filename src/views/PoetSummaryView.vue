<template>
    <div class="poet-summary-view">
        <div class="dynasty-choose">
            <button v-for="(dynasty, index) in dynasties" :key="index"
                :class="['dynasty-button', { active: selectedDynasty === index }]" @click="selectDynasty(index)">
                {{ dynasty }}
            </button>
        </div>
        <div class="main">
            <div class="left">
                <RegionBarComp :info="selectedRegionInfo" :id="selectedDynasty" :regionName="selectedRegionName"
                    :regionValue="selectedRegionValue" />
                <PoetSanKeyComp :nodes="selectedSankey.nodes" :links="selectedSankey.links" />
            </div>
            <div class="right">
                <RelationGraphComp :nodes="selectedNodes" :links="selectedLinks" :infos="selectedInfos"
                    :id="selectedDynasty" />
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
// @ts-nocheck
import RegionBarComp from '@/components/ReigonBarComp.vue'
import PoetSanKeyComp from '@/components/PoetSanKeyComp.vue'
import RelationGraphComp from '@/components/RelationGraphComp.vue'

import tangRegion from '@/assets/data/tang/region.json'
import songRegion from '@/assets/data/song/region.json'
import yuanRegion from '@/assets/data/yuan/region.json'
import regionInfo from '@/assets/data/region_info.json'

import tangPoetSankey from '@/assets/data/tang/poet_sankey.json'
import songPoetSankey from '@/assets/data/song/poet_sankey.json'
import yuanPoetSankey from '@/assets/data/yuan/poet_sankey.json'

import tangNodes from '@/assets/data/tang/network/nodes.json'
import tangLinks from '@/assets/data/tang/network/links.json'
import tangInfos from '@/assets/data/tang/network/infos.json'

import songNodes from '@/assets/data/song/network/nodes.json'
import songLinks from '@/assets/data/song/network/links.json'
import songInfos from '@/assets/data/song/network/infos.json'

import yuanNodes from '@/assets/data/yuan/network/nodes.json'
import yuanLinks from '@/assets/data/yuan/network/links.json'
import yuanInfos from '@/assets/data/yuan/network/infos.json'

import { onMounted, ref } from 'vue'

const modules = import.meta.glob('/src/assets/images/network/*');
const avatar = async (name) => {
    const path = `/src/assets/images/network/${name}.png`;
    const module = await modules[path]();
    return module.default;
}

const selectedDynasty = ref(0);
const dynasties = ['唐', '宋', '元'];
const selectedRegionName = ref([]);
const selectedRegionValue = ref([]);
const selectedRegionInfo = ref([]);
const selectedSankey = ref({
    nodes: [],
    links: []
});
const selectedNodes = ref([]);
const selectedLinks = ref([]);
const selectedInfos = ref({});

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

const selectDynasty = async (index: number) => {
    selectedDynasty.value = index;

    switch (index) {
        case 0:
            // @ts-ignore
            [selectedRegionName.value, selectedRegionValue.value, selectedRegionInfo.value] = preprocessRegion(tangRegion);
            selectedSankey.value = tangPoetSankey;
            selectedNodes.value = tangNodes;
            selectedLinks.value = tangLinks;
            selectedInfos.value = tangInfos;
            break;
        case 1:
            // @ts-ignore
            [selectedRegionName.value, selectedRegionValue.value, selectedRegionInfo.value] = preprocessRegion(songRegion);
            selectedSankey.value = songPoetSankey;
            selectedNodes.value = songNodes;
            selectedLinks.value = songLinks;
            selectedInfos.value = songInfos;
            break;
        case 2:
            // @ts-ignore
            [selectedRegionName.value, selectedRegionValue.value, selectedRegionInfo.value] = preprocessRegion(yuanRegion);
            selectedSankey.value = yuanPoetSankey;
            selectedNodes.value = yuanNodes;
            selectedLinks.value = yuanLinks;
            selectedInfos.value = yuanInfos;
            break;
    }
}

onMounted(async () => {
    selectDynasty(0);
})
</script>

<style scope lang="scss">
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
        font-family: 'TitleFont';
        border-radius: 50%;
        background-color: rgba(60, 60, 60, 0.1);
        border: 2px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 25px;
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

.poet-summary-view {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .main {
        width: 95%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 10px;

        .left {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .right {
            flex: 1;
            height: 100%;
        }
    }
}
</style>