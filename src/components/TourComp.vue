<template>
    <div style="display: flex;align-items: center;position: relative;">
        <canvas ref="liveCanvas" class="live-canvas"></canvas>
        <p class="tour-txt">
            {{ props.content }}
        </p>
    </div>
</template>

<script setup lang='ts'>
// @ts-nocheck
import { ref, onUnmounted, onMounted } from 'vue';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display/cubism4';
import { log } from 'echarts/types/src/util/log.js';

window.PIXI = PIXI; // 为了pixi-live2d-display内部调用
let app; // 为了存储pixi实例
let model; // 为了存储live2d实例
const liveCanvas = ref();

const props = defineProps({
    content: {
        type: String,
        default: '',
        required: true
    }
})

onMounted(async () => {
    const savedCompId = localStorage.getItem('compId');
    if (savedCompId) {
        compId.value = parseInt(savedCompId);
    }

    // 总耗时计时开始
    const totalStart = performance.now();
    let stageStart: number;

    // 1. 创建PIXI应用计时
    console.time('[PIXI.Application] 初始化耗时');
    app = new PIXI.Application({
        view: liveCanvas.value,
        autoStart: true,
        resizeTo: window,
        backgroundAlpha: 0,
    });
    console.timeEnd('[PIXI.Application] 初始化耗时');

    const modelPath = `${import.meta.env.BASE_URL}live2d/model/poet.model3.json`;

    // 2. 模型加载计时
    console.time('[Live2D] 模型加载耗时');
    const modelLoadStart = performance.now();
    model = await Live2DModel.from(modelPath);
    const modelLoadEnd = performance.now();
    console.timeEnd('[Live2D] 模型加载耗时');

    // 3. 添加到舞台耗时
    stageStart = performance.now();
    app.stage.addChild(model);
    const stageEnd = performance.now();

    // 4. 缩放设置耗时
    const scaleStart = performance.now();
    model.scale.set(0.2);
    const scaleEnd = performance.now();

    // 总耗时计算
    const totalEnd = performance.now();

    // 打印详细性能报告
    console.log('\n=== 性能分析报告 ===');
    console.log(`1. PIXI应用初始化: ${(modelLoadStart - totalStart).toFixed(2)}ms`);
    console.log(`2. Live2D模型加载: ${(modelLoadEnd - modelLoadStart).toFixed(2)}ms`);
    console.log(`3. 添加到舞台耗时: ${(stageEnd - stageStart).toFixed(2)}ms`);
    console.log(`4. 缩放设置耗时: ${(scaleEnd - scaleStart).toFixed(2)}ms`);
    console.log(`5. 总耗时: ${(totalEnd - totalStart).toFixed(2)}ms`);
    console.log('====================\n');
});

onUnmounted(() => {
    model?.destroy();
    app?.destroy();
});
</script>

<style scope lang="scss">
.tour-txt {
    width: 300px;
    padding: 8px;
    font-family: 'ContentFont';
    font-size: 18px;
    color: #000000;
    background-color: antiquewhite;
    border-bottom-left-radius: 16px;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
    margin-left: 6rem;
    margin-bottom: 0;
}

.live-canvas {
    position: absolute;
    left: -2%;
    width: 250px;
    height: 120px;
    z-index: -1;
}
</style>