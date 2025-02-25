<template>
    <nav class="nav-bar">
        <div class="nav-item" v-for="(item, index) in navItems" :key="index" :class="{ active: currentIndex === index }"
            @click="handleClick(index)">
            <div>{{ item.title }}</div>
        </div>
    </nav>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
import router from '@/router';

const navItems = [
    { title: '诗韵初章', link: '/home' },
    { title: '诗络寻踪', link: '/network' },
    { title: '诗蕴析微', link: '/poetry' },
    { title: '诗家探源', link: '/poet' },
    { title: '诗韵飞花', link: '/feihua' },
];

const currentIndex = ref(0);
const handleClick = (index: number) => {
    currentIndex.value = index;
    router.push(navItems[index].link);
};

watch(() => router.currentRoute.value.path, (newPath) => {
    const index = navItems.findIndex((item) => item.link === newPath);
    if (index !== -1) {
        currentIndex.value = index;
    }
}, {
    immediate: true
})
</script>

<style scoped lang="scss">
.nav-bar {
    width: 80%;
    margin: 0 auto;
    height: 70px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
}

.nav-item {
    text-align: center;
    font-family: 'GlobalFont', sans-serif;
    font-size: 28px;
    font-weight: 800;
    padding: 8px;
    user-select: none;
    cursor: pointer;
    transition: color 0.3s ease, transform 0.3s ease; // 添加平滑过渡效果
    position: relative;
    transform: scale(1); // 初始缩放比例

    &:hover {
        color: #a9304c;
        transform: scale(1.1); // 鼠标悬停时稍微放大
    }

    &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: #a9304c;
        border-radius: 2px;
        transform: scaleX(0); // 初始状态下缩放为0
        transition: transform 0.3s ease; // 添加平滑过渡效果
        transform-origin: left;
    }

    &.active {
        color: #a9304c;
        transform: scale(1.1); // 当前选中时稍微放大

        &::before {
            transform: scaleX(1); // 选中时拉伸到100%
        }
    }
}
</style>