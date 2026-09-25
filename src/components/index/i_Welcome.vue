<script setup>
import { onMounted,onUnmounted, ref } from 'vue';
import { effect } from '@/modules/effect';
const tw = effect.effect_typewriter_marker()

onMounted(() =>
    tw.start(['欢迎来到我的博客', 'Welcome to my blog'],{
        typeSpeed: 100,    // 打字速度
        deleteSpeed: 40,   // 删除速度
        pauseMs: 3000      // 换句停顿
        }
    )
)
onUnmounted(() =>
    tw.stop()
)
</script>

<template>
    <div class="welcome">
        {{ tw.tw_string }}
    </div>
</template>

<style scoped>
.welcome {
    width: fit-content;
    height: 50vh;

    display: flex;
    justify-content: center;
    align-items: center;

    color: var(--g-color);

    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    margin: 0;
    line-height: 1.2;
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
    /* [响应式-lg] 大屏 */
}

@media (max-width: 1024px) {
    /* [响应式-md] 平板 */
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机 */
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
}

</style>