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
                <PoetSanKeyComp :nodes="selectedSankey.nodes" :links="selectedSankey.links" />
                <PoetryCateBarComp :id="selectedDynasty" :regionName="selectedCateName"
                    :regionValue="selectedCateValue" />
            </div>
            <div class="right">
                <div class="legends">
                    <div class="legend" v-for="(item, index) in legend[selectedDynasty]" :key="index">
                        <div class="circle" :style="{ backgroundColor: item.color }"></div>
                        <div class="name">{{ item.name }}</div>
                    </div>
                </div>
                <RelationGraphComp :nodes="selectedNodes" :links="selectedLinks" :infos="selectedInfos"
                    :id="selectedDynasty" />
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
// @ts-nocheck
import PoetryCateBarComp from '@/components/PoetryCateBarComp.vue'
import PoetSanKeyComp from '@/components/PoetSanKeyComp.vue'
import RelationGraphComp from '@/components/RelationGraphComp.vue'

import tangPoetryCate from '@/assets/data/tang/natural_science.json'
import songPoetryCate from '@/assets/data/song/natural_science.json'
import yuanPoetryCate from '@/assets/data/yuan/natural_science.json'

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
const selectedCateName = ref([]);
const selectedCateValue = ref([]);
const selectedSankey = ref({
    nodes: [],
    links: []
});
const selectedNodes = ref([]);
const selectedLinks = ref([]);
const selectedInfos = ref({});
const legend = ref([
    [
        {
            name: '浪漫主义诗派',
            color: '#f4a460'
        },
        {
            name: '现实主义诗派',
            color: '#919e8b'
        },
        {
            name: '山水田园诗派',
            color: '#d87c7c'
        },
        {
            name: '边塞诗派',
            color: '#0e6aab'
        },
    ],
    [
        {
            name: '豪放派',
            color: '#f4a460'
        },
        {
            name: '婉约派',
            color: '#919e8b'
        }
    ],
    [
        {
            name: '豪放派',
            color: '#f4a460'
        },
        {
            name: '清丽派',
            color: '#919e8b'
        }
    ]
])

const preprocessCate = (cate: Array) => {
    selectedCateName.value = [];
    selectedCateValue.value = [];
    for (let i = 0; i < cate.length; i++) {
        selectedCateName.value.push(cate[i].name);
        selectedCateValue.value.push(cate[i].value);
    }
}

const selectDynasty = async (index: number) => {
    selectedDynasty.value = index;

    switch (index) {
        case 0:
            // @ts-ignore
            preprocessCate(tangPoetryCate);
            selectedSankey.value = tangPoetSankey;
            selectedNodes.value = tangNodes;
            selectedLinks.value = tangLinks;
            selectedInfos.value = tangInfos;
            break;
        case 1:
            // @ts-ignore
            preprocessCate(songPoetryCate);
            selectedSankey.value = songPoetSankey;
            selectedNodes.value = songNodes;
            selectedLinks.value = songLinks;
            selectedInfos.value = songInfos;
            break;
        case 2:
            // @ts-ignore
            preprocessCate(yuanPoetryCate);
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
            position: relative;

            .legends {
                position: absolute;
                top: 8%;
                left: 5%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 10px;

                .legend {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 8px;

                    .circle {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                    }

                    .name {
                        font-family: 'ContentFont';
                        font-size: 20px;
                    }
                }
            }
        }
    }
}
</style>