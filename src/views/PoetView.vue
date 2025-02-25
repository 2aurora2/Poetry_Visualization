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
                :regionValue="selectedRegionValue"/>
            <PoetSanKeyComp :nodes="selectedSankey.nodes" :links="selectedSankey.links"/>
        </div>
        <div class="poet-details">
            <div class="search-box">
                <input type="text" class="poet-search" placeholder="请输入诗人姓名" v-model="poetName" @keypress.enter="queryPoet">
                <el-button circle type="warning" :icon="Search" @click="queryPoet"></el-button>
            </div>
            <PoetCardComp 
                :nodes="poetInfo?.nodes" 
                :links="poetInfo?.links" 
                :works="poetInfo?.representative_works"
                :emotions="poetInfo?.emotions"
                :avatar="poetInfo?.avatar"
                :name="poetInfo?.name"
                :gender="poetInfo?.gender"
                :address="poetInfo?.address"
                :YearBirth="poetInfo?.yearBirth"
                :YearDeath="poetInfo?.yearDeath"
                :desc="poetInfo?.desc"
            />
        </div>
    </div>
</template>

<script setup lang='ts'>
import tangRegion from '@/assets/data/tang/region.json'
import songRegion from '@/assets/data/song/region.json'
import yuanRegion from '@/assets/data/yuan/region.json'
import regionInfo from '@/assets/data/region_info.json'

import PoetCardComp from '@/components/PoetCardComp.vue'
import RegionBarComp from '@/components/ReigonBarComp.vue'
import PoetSanKeyComp from '@/components/PoetSanKeyComp.vue'

import tangLink from '@/assets/data/tang/links_with_name.json'
import songLink from '@/assets/data/song/links_with_name.json'
import yuanLink from '@/assets/data/yuan/links_with_name.json'

import tangWorkDetails from '@/assets/data/tang/work_details.json'
import songWorkDetails from '@/assets/data/song/work_details.json'
import yuanWorkDetails from '@/assets/data/yuan/work_details.json'

import tangPoetryInfo from '@/assets/data/tang/poet_basic_info.json'
import songPoetryInfo from '@/assets/data/song/poet_basic_info.json'
import yuanPoetryInfo from '@/assets/data/yuan/poet_basic_info.json'

import tangPoetSankey from '@/assets/data/tang/poet_sankey.json'
import songPoetSankey from '@/assets/data/song/poet_sankey.json'
import yuanPoetSankey from '@/assets/data/yuan/poet_sankey.json'

import { Search } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import type { ILink, INode, IPoet } from '../interface/poet'
import CONST from '../const'

const selectedDynasty = ref(0);
const dynasties = ['唐', '宋', '元'];
const selectedRegionName = ref([]);
const selectedRegionValue = ref([]);
const selectedRegionInfo = ref([]);
const selectedSankey = ref({});

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
            selectedSankey.value = tangPoetSankey;
            poetName.value = '李白';
            break;
        case 1:
            // @ts-ignore
            [selectedRegionName.value, selectedRegionValue.value, selectedRegionInfo.value] = preprocessRegion(songRegion);
            selectedSankey.value = songPoetSankey;
            poetName.value = '苏轼';
            break;
        case 2:
            // @ts-ignore
            [selectedRegionName.value, selectedRegionValue.value, selectedRegionInfo.value] = preprocessRegion(yuanRegion);
            selectedSankey.value = yuanPoetSankey;
            poetName.value = '元好问';
            break;
    }
    queryPoet();
}

const poetName = ref('');
const poetInfo = ref<IPoet>(CONST.DEFAULT_POET);
const queryPoet = () => {
    if (poetName.value.length === 0) {
        // @ts-ignore
        ElMessage.warning('请输入诗人姓名');
        return;
    }
    // (1) 预处理诗人的关系图信息
    let sLinks = selectedDynasty.value === 0 ? tangLink : selectedDynasty.value === 1 ? songLink : yuanLink;
    let nodes: INode[] = [{
        name: poetName.value,
        isCenter: true,
    }];
    let targetNodes = new Set();
    let links: ILink[] = [];
    for (let i = 0; i < sLinks.length; i++) {
        if (sLinks[i]['source'] === poetName.value) {
            targetNodes.add(sLinks[i]['target']);
            let flag = false;
            for (let j = 0; j < links.length; j++) {
                if (links[j]['source'] === sLinks[i]['source'] && links[j]['target'] === sLinks[i]['target']) {
                    links[j]['name'].push(sLinks[i]['name']);
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                links.push({
                    source: sLinks[i]['source'],
                    target: sLinks[i]['target'],
                    name: [sLinks[i]['name']],
                    lineStyle: {
                        width: 2,
                        curvenness: 0.2,
                    }
                });
            }
        }
    }
    for (const target of targetNodes) {
        nodes.push({
            name: target as string,
        });
    }
    poetInfo.value!['nodes'] = nodes;
    poetInfo.value!['links'] = links;
    // (2) 预处理诗人的作品信息
    let sWorkDetails = selectedDynasty.value === 0? tangWorkDetails : selectedDynasty.value === 1? songWorkDetails : yuanWorkDetails;
    poetInfo.value!['representative_works'] = sWorkDetails[poetName.value]['representative_works'] ? sWorkDetails[poetName.value]['representative_works'] : [];
    poetInfo.value!['emotions'] = sWorkDetails[poetName.value]['emotion'];
    // (3) 预处理诗人的基本信息
    let sPoetryInfo = selectedDynasty.value === 0? tangPoetryInfo : selectedDynasty.value === 1? songPoetryInfo : yuanPoetryInfo;
    poetInfo.value!['avatar'] = sPoetryInfo[poetName.value]['avatar'] === '' ? undefined : sPoetryInfo[poetName.value]['avatar'];
    poetInfo.value!['name'] = sPoetryInfo[poetName.value]['ChineseName'];
    poetInfo.value!['gender'] = sPoetryInfo[poetName.value]['Gender'];
    poetInfo.value!['address'] = sPoetryInfo[poetName.value]['Address'];
    poetInfo.value!['yearBirth'] = sPoetryInfo[poetName.value]['YearBirth'];
    poetInfo.value!['yearDeath'] = sPoetryInfo[poetName.value]['YearDeath'];
    poetInfo.value!['desc'] = sPoetryInfo[poetName.value]['desc'];
}

onMounted(async () => {
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
            width: 95%;
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
        font-family: 'GlobalFont';
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
</style>