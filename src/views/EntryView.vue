<template>
    <div class="home-container">
        <div class="content-wrapper">
            <div class="title-container">
                <h1 class="title">韵·代：诗词文化的视觉交响</h1>
            </div>
            <div class="intro-container">
                <p>
                    本项目聚焦唐诗、宋词、元曲等丰富数据，通过多维度数据分析，挖掘古典诗词的丰富内涵。通过将复杂分析结果转化为直观图像，打破古今文化理解壁垒，提供全新视角解读经典，助力传统文化在数字时代绽放新光彩，促进传统诗词与现代数据可视化的深度融合。
                </p>
            </div>
            <div class="arrow-container" @click="navigateToHome">
                <div class="arrow">></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToHome = () => {
    const content = document.querySelector('.content-wrapper') as HTMLElement | null
    if (content) {
        content.style.transition = 'transform 1s ease-in-out'
        content.style.transform = 'translateY(-100vh)'
        setTimeout(() => {
            router.push('/home')
        }, 1000)
    }
}
</script>

<style scoped lang="scss">
.home-container {
    position: relative;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}

.content-wrapper {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: transform 1s ease-in-out;
}

.title-container {
    text-align: center;
    margin-bottom: 2rem;
}

.intro-container {
    width: 80%;
    max-width: 800px;
    margin-bottom: 2rem;
    text-align: justify;
    font-family: 幼圆, serif;
    font-size: 20px;
    line-height: 30px;
    cursor: pointer;
}

.title {
    font-family: 'STKaiti', serif;
    font-size: 3rem;
    color: #333;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.5);
}

.arrow-container {
    position: absolute;
    bottom: 2rem;
    cursor: pointer;
}

.arrow {
    font-size: 3rem;
    color: #666;
    transform: rotate(90deg);
    animation: bounce 2s infinite;
    cursor: pointer;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.arrow:hover {
    color: #333;
    transform: rotate(90deg) scale(1.1);
}

@keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
        transform: rotate(90deg) translateX(0);
    }

    40% {
        transform: rotate(90deg) translateX(-20px);
    }

    60% {
        transform: rotate(90deg) translateX(-10px);
    }
}
</style>
