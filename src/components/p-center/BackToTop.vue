<script setup>
import VIcon from '@/components/__common/VIcon.vue'
import { useScrollStore, useImmersiveStore } from '../../stores'

const scrollStore = useScrollStore()
const immersiveStore = useImmersiveStore()

</script>

<template>
    <!-- 正常状态下的返回顶部按钮 -->
    <button
        v-if="!immersiveStore.is_immersive"
        class="back-to-top-btn"
        title="返回顶部"
        @click="scrollStore.scroll_to_top"
    >
        <VIcon :src="'arrow-up.svg'" :size="24" />
    </button>
    <!-- 沉浸阅读状态下的返回顶部按钮 -->
    <button
        v-else="immersiveStore.is_immersive"
        class="back-to-top-btn immersive visible"
        title="返回顶部"
        @click="scrollStore.scroll_to_top"
    >
        <VIcon :src="'arrow-up.svg'" :size="24" />
    </button>
</template>

<style scoped>
.back-to-top-btn {
    width: 38px;
    height: 38px;

    border-radius: 50%;
    border: 1px solid var(--common-color-1);
    
    display: flex;
    justify-content: center;
    align-items: center;
    
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
    opacity: 1;
    visibility: visible;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    
    background: var(--common-color-1);

    color: #fff;
    box-shadow: 0 2px 8px color-mix(in srgb, var(--common-color-1) 30%, transparent);
}

.back-to-top-btn.immersive {
    bottom: 24px;
    right: 34px;

    position: fixed;
    z-index: 9998;
}

.back-to-top-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 14px color-mix(in srgb, var(--common-color-1) 40%, transparent);
}

@media (max-width: 768px) {
    .back-to-top-btn.immersive {
        bottom: 16px;
        right: 26px;
        width: 36px;
        height: 36px;
    }

    .back-to-top-btn.immersive img {
        width: 18px;
        height: 18px;
    }
}

@media (max-width: 640px) {
    .back-to-top-btn.immersive {
        bottom: 72px;
        right: 22px;
    }
}
</style>