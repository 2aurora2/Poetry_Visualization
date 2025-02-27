<template>
    <div class="feihua-container">
        <div class="body">
            <h1 class="title center-align">诗韵飞花</h1>
            <div class="rules" v-show="compId === 0">
                <h3 class="subtitle center-align">与AI来一场酣畅淋漓的飞花令挑战吧</h3>
                <ol class="icon-rule-list">
                    <li class="icon-rule-item">与AI轮流回答包含某个意象（如山、水等）的一句诗词，意象在诗词的位置不作限制。</li>
                    <li class="icon-rule-item">禁止回答任一方曾经回答过的诗词。</li>
                    <li class="icon-rule-item">如若需要帮助可以输入[提示]，AI会给予一个包含指定意象的诗词作品名，但<strong>有且仅有</strong>3次提示机会。</li>
                    <li class="icon-rule-item">如若作答不出，请输入[我认输]，本轮游戏将会结束；若你的回答违反规则，同样本轮游戏也将会结束。</li>
                    <li class="icon-rule-item">准备好了吗？准备好了那就点击下方按钮抽取本轮意象并开启挑战吧。</li>
                </ol>
                <button class="start-button" @click="chooseImagery">开始游戏</button>
            </div>
            <div class="imagery-choose" v-show="compId === 1">
                <div class="imagery-container">
                    <img :src="currentImagery.path" :alt="currentImagery.name" class="imagery-image" />
                </div>
            </div>
            <div class="chat-comp" v-show="compId === 2">
                <ChatComp></ChatComp>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onUnmounted, watch, onMounted } from 'vue';
import { useChatStore } from '../store/useChatStore';
import ChatComp from '@/components/ChatComp.vue';
import { chat } from '../utils/llm';

const chatStore = useChatStore();

const compId = ref(0);
const rollCount = ref(0);
const maxRolls = 20;
const targetIndex = ref(0);
const imageries = ref([
    { name: '船', path: ref('src/assets/images/imagery/chuan.png') },
    { name: '风', path: ref('src/assets/images/imagery/feng.png') },
    { name: '酒', path: ref('src/assets/images/imagery/jiu.png') },
    { name: '柳', path: ref('src/assets/images/imagery/liu.png') },
    { name: '梅', path: ref('src/assets/images/imagery/mei.png') },
    { name: '山', path: ref('src/assets/images/imagery/shan.png') },
    { name: '水', path: ref('src/assets/images/imagery/shui.png') },
    { name: '雁', path: ref('src/assets/images/imagery/yan.png') },
    { name: '月', path: ref('src/assets/images/imagery/yue.png') },
])

const currentImagery = ref(imageries.value[0]);
let currentImageIndex = 0;
let interval: number | undefined;

const chooseImagery = () => {
    compId.value = 1;
    targetIndex.value = Math.floor(Math.random() * imageries.value.length);
    rollToTarget(targetIndex.value);
}

const rollToTarget = (targetIndex: number) => {
    rollCount.value = 0;

    interval = window.setInterval(() => {
        currentImageIndex++;
        if (currentImageIndex >= imageries.value.length) {
            currentImageIndex = 0;
        }

        currentImagery.value = imageries.value[currentImageIndex];
        rollCount.value++;

        if (rollCount.value >= maxRolls) {
            window.clearInterval(interval);
            currentImagery.value = imageries.value[targetIndex];
        }
    }, 100);
};

watch(rollCount, () => {
    if (rollCount.value === maxRolls) {
        window.setTimeout(async () => {
            chatStore.messages.push({
                role: 'user',
                content: `意象抽取结果为【${imageries.value[targetIndex.value].name}】`
            });
            try {
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => {
                        reject(new Error('Timeout Error')); 
                    }, 5000);
                });
                const res = await Promise.race([chat(chatStore.messages), timeoutPromise]);
                chatStore.messages = res.data.data;
                compId.value = 2;
            } catch (error) {
                compId.value = 0;
                ElMessage.error('请求失败，请稍后重试！');
                chatStore.messages = [];
            }
        }, 200);
    }
})

watch(compId, () => {
    localStorage.setItem('compId', compId.value.toString());
})

onMounted(() => {
    const savedCompId = localStorage.getItem('compId');
    if (savedCompId) {
        compId.value = parseInt(savedCompId);
    }
})

onUnmounted(() => {
    if (interval) {
        window.clearInterval(interval);
    }
});
</script>

<style scoped lang="scss">
$color-primary: #3d0b0b; // 主色调
$color-secondary: #d7ab82; // 按钮颜色
$color-text: #eb8585; // 文字颜色

.feihua-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.body {
    width: 60%;
    padding: 2rem;
    border-radius: 12px;
    background-color: transparent;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.1));

    display: flex;
    flex-direction: column;
    align-items: center;

    .title.center-align {
        text-align: center;
        font-size: 3rem;
        font-family: 'ContentFont';
        color: $color-primary;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
        border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    }

    .subtitle.center-align {
        text-align: center;
        font-size: 1.5rem;
        color: $color-text;
        margin-bottom: 1.5rem;
        font-family: 'ContentFont';
    }

    .imagery-choose {
        .imagery-container {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border: #cc7e63 2px solid;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            // filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            transition: transform 0.3s ease-in-out;

            .imagery-image {
                width: 100%;
                height: 100%;
                object-fit: fill;
            }
        }
    }

    .chat-comp {
        width: 100%;
    }

    .icon-rule-list {
        padding-left: 1.5rem;
        list-style-type: none;

        .icon-rule-item {
            font-size: 1.125rem;
            font-weight: 600;
            font-family: 'ContentFont';
            color: $color-text;
            padding: 1rem;
            position: relative;

            &:before {
                content: "▲";
                position: absolute;
                top: 50%;
                left: -1rem;
                transform: translateY(-50%);
                font-size: 1.25rem;
                color: $color-primary;
                font-weight: bold;
            }
        }
    }

    .start-button {
        display: block;
        width: 80%;
        margin: 2rem auto;
        padding: 1rem;
        font-family: 'ContentFont';
        background-color: $color-secondary;
        color: #ffffff;
        font-size: 1.125rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: #cc7e63;
        }
    }
}
</style>