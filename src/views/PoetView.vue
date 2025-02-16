<template>
    <div>
    <RegionBarComp :info="selectedRegionInfo" :id="selectedDynasty" :regionName="selectedRegionName"
    :regionValue="selectedRegionValue" :width="600"></RegionBarComp>
    </div>
</template>

<script setup lang='ts'>
import tangRegion from '@/assets/data/tang/region.json'
import songRegion from '@/assets/data/song/region.json'
import yuanRegion from '@/assets/data/yuan/region.json'
import regionInfo from '@/assets/data/region_info.json'

import RegionBarComp from '@/components/ReigonBarComp.vue'

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
    let tar = 11;
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

onMounted(() => {
    selectDynasty(0);
})
</script>

<style scope lang="scss"></style>