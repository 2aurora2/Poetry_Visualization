<template>
    <div class="network-container">
        <div class="network">
            <div class="dynasty-choose">
                <button v-for="(dynasty, index) in dynasties" :key="index"
                    :class="['dynasty-button', { active: selectedDynasty === index }]" @click="selectDynasty(index)">
                    {{ dynasty }}
                </button>
            </div>
            <RelationNetwork :nodes="selectedNodes" :links="selectedLinks" :info="selectedInfos" :width="graphWidth"
                :id="selectedDynasty" />
        </div>
        <div class="bar-tree">
            <GeneralCateRelationComp :width="graphWidth" />
            <SpecificCateTreemap :width="treeWidth" :data="selectedCates" :id="selectedDynasty"/>
        </div>
    </div>
</template>

<script setup lang='ts'>
import RelationNetwork from '@/components/RelationGraphComp.vue'
import GeneralCateRelationComp from '@/components/GeneralCateRelationComp.vue'
import SpecificCateTreemap from '@/components/SpecificCateTreemap.vue'
import tang_nodes from '@/assets/data/tang/nodes.json'
import tang_links from '@/assets/data/tang/links.json'
import tang_infos from '@/assets/data/tang/poet_basic_info.json'
import tang_cates from '@/assets/data/tang/specific_cate.json'
import song_nodes from '@/assets/data/song/nodes.json'
import song_links from '@/assets/data/song/links.json'
import song_infos from '@/assets/data/song/poet_basic_info.json'
import song_cates from '@/assets/data/song/specific_cate.json'
import yuan_nodes from '@/assets/data/yuan/nodes.json'
import yuan_links from '@/assets/data/yuan/links.json'
import yuan_infos from '@/assets/data/yuan/poet_basic_info.json'
import yuan_cates from '@/assets/data/yuan/specific_cate.json'

import { onMounted, ref } from 'vue'

const graphWidth = ref(800);
const barWidth = ref(400);
const treeWidth = ref(400);

const selectedDynasty = ref(0);
const dynasties = ['唐', '宋', '元'];

const selectedNodes = ref(tang_nodes);
const selectedLinks = ref(tang_links);
const selectedInfos = ref(tang_infos);
const selectedCates = ref(tang_cates);

const selectDynasty = (index: number) => {
    selectedDynasty.value = index;
    switch (index) {
        case 0:
            selectedNodes.value = tang_nodes;
            selectedLinks.value = tang_links;
            selectedInfos.value = tang_infos;
            selectedCates.value = tang_cates;
            break;
        case 1:
            selectedNodes.value = song_nodes;
            selectedLinks.value = song_links;
            selectedInfos.value = song_infos;
            selectedCates.value = song_cates;
            break;
        case 2:
            selectedNodes.value = yuan_nodes;
            selectedLinks.value = yuan_links;
            selectedInfos.value = yuan_infos;
            selectedCates.value = yuan_cates;
            break;
    }
}

onMounted(() => {
    const network = document.querySelector('.network') as HTMLElement;
    const barTree = document.querySelector('.bar-tree') as HTMLElement;
    graphWidth.value = network.offsetWidth;
    barWidth.value = barTree.offsetWidth;
    treeWidth.value = barTree.offsetWidth;
})
</script>

<style scope lang="scss">
.network-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .network {
        flex: 1;

        .dynasty-choose {
            width: 100%;
            display: flex;
            gap: 10px;
            display: flex;
            flex-direction: row;
            justify-content: center;

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
    }

    .bar-tree {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}
</style>