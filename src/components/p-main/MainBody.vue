<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
    <div class="main-body">
        <router-view v-slot="{ Component: RouteComponent }">
            <Transition name="change" mode="out-in">
                <component :is="RouteComponent" :key="route.fullPath" />
            </Transition>
        </router-view>
    </div>
</template>

<style scoped>
.main-body {
    flex: 1;
    min-height: 0;

    background: transparent;
    overflow-y: auto;
}
</style>

<!-- 路由切换动画的类 -->
<style>
.change-enter-active,
.change-leave-active {
    transition:
        opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 进场起点：透明 + 从下方放大浮起，制造"从纵深推入"感 */
.change-enter-from {
    opacity: 0;
    transform: translateY(24px) scale(0.985);
}

/* 离场终点：透明 + 向上微收，配合进场形成错层 */
.change-leave-to {
    opacity: 0;
    transform: translateY(-12px) scale(0.99);
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
