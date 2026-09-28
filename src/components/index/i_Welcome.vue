<script setup>
import { onMounted } from 'vue';
import { typeWrite } from '@/composables/index.js';
// [AI迁移] 打字机已成全局单例：直接引用实例，不再经 index() 工厂
const tw = typeWrite

onMounted(() =>
    tw.init(['欢迎来到我的博客', 'Welcome to my blog'],
        100,    // typeSpeed 打字速度
        40,     // deleteSpeed 删除速度
        3000    // pauseMs 换句停顿
    )
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
    .welcome { height: 44vh; }
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机 */
    .welcome { height: 38vh; }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
    .welcome { height: 32vh; font-size: clamp(1.5rem, 6vw, 2.4rem); }
}

</style>