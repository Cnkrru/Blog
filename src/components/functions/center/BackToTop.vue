<script setup lang="ts">
const scrollToTop = (): void => {
    // 检查是否处于沉浸阅读模式
    const isImmersiveReading : boolean = document.body.classList.contains('immersive-reading');
    
    if (isImmersiveReading) {
        // 在沉浸阅读模式下，滚动整个窗口
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        // 正常模式下，滚动中心卡片内容
        const centerCardContent : HTMLElement | null = document.querySelector('.center-card-content') as HTMLElement | null;
        if (centerCardContent) {
            centerCardContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // 如果找不到中心卡片内容，滚动整个窗口
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
}
</script>

<template>
    <button class="back-to-top-btn" @click="scrollToTop">
        <img src="../../../assets/imgs/svg/arrow-up.svg" alt="返回顶部">
    </button>
</template>

<style scoped>
/* 返回顶部按钮样式 - 与页眉功能按钮一致 */
.back-to-top-btn {
    width: 40px;
    height: 40px;
    border-radius: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-right: 10px;
}

/* 沉浸阅读模式下的返回顶部按钮 */
body.immersive-reading .back-to-top-btn {
    position: fixed;
    bottom: 80px;
    right: 20px;
    z-index: 9998;
    margin-right: 0;
    box-shadow: 0 4px 12px var(--shadow-color);
}

.back-to-top-btn:hover {
    transform: scale(1.1);
}

/* 返回顶部按钮图标 */
.back-to-top-btn img {
    width: 20px;
    height: 20px;
    transition: filter 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
    body.immersive-reading .back-to-top-btn {
        bottom: 70px;
        right: 10px;
        width: 36px;
        height: 36px;
    }
    
    body.immersive-reading .back-to-top-btn img {
        width: 18px;
        height: 18px;
    }
}
</style>