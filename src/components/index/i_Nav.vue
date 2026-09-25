<script setup>
import { ref } from 'vue';
const nav = ref([
    { name: '文章', path: '/posts' },
    { name: '关于', path: '/about' },
    { name: '归档', path: '/archives' },
    { name: '标签', path: '/tags' },
    { name: '链接', path: '/links' },
    { name: '项目', path: '/projects' },
    { name: '设置', path: '/settings' }
])
</script>

<template>
    <nav class="index-nav">
        <router-link v-for="item in nav" :key="item.path" :to="item.path" class="nav-element">{{ item.name }}</router-link>
    </nav>
</template>

<style scoped>
.index-nav {
    width:100%;
    height: fit-content;
    max-height: 240px;

    display: flex;
    justify-content: end;
    align-items: center;
    flex-direction: row;
    gap: var(--space-lg);

    padding: var(--space-sm);
    margin-bottom: var(--space-xs);
    
    text-align: center;
    overflow-y: auto;
    background: transparent;
}

.nav-element {
    position: relative;
    width: fit-content;
    height: fit-content;

    padding: 6px 0;
    border-radius: var(--radius-md);

    text-decoration: none;
    color: var(--g-text);
    opacity: 0.7;
    transition: color 0.2s ease;
}

.nav-element::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    border-radius: 2px;
    background: var(--g-color);
    transition: width 0.3s ease;
}

.nav-element:hover {
    color: var(--g-color);
    opacity: 1;
}

.nav-element:hover::after {
    width: 100%;
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