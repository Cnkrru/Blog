<script setup>
import { ref } from 'vue';

const nav = ref([
    { name: '文章', path: '/posts' },
    { name: '关于', path: '/about' },
    { name: '归档', path: '/archives' },
    { name: '标签', path: '/tags' },
    { name: '链接', path: '/links' },
    { name: '设置', path: '/settings' }
])
</script>

<template>
    <nav class="sidebar-nav">
        <router-link v-for="item in nav" :key="item.path" :to="item.path" class="nav-element">{{ item.name }}</router-link>
    </nav>
</template>

<style scoped>
.sidebar-nav {
    width:100%;
    height: fit-content;
    max-height: 240px;

    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: var(--space-xs);

    padding: var(--space-sm);
    margin-bottom: var(--space-xs);
    
    text-align: center;
    overflow-y: auto;
    background: transparent;
}

.nav-element {
    width: fit-content;
    height: fit-content;
    min-width: 160px;
    min-height: 40px;

    padding: var(--space-sm);
    border: var(--border-width) solid color-mix(in srgb, var(--g-text) 8%, transparent);
    border-radius: var(--radius-md);

    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);

    transition:
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.2s ease,
        border-color 0.2s ease,
        background-color 0.2s ease;

    text-decoration: none;
    color: var(--g-text);
}


.nav-element:hover {
    transform: translateY(-2px);
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
    border-color: color-mix(in srgb, var(--g-text) 15%, transparent);
    box-shadow: 0 4px 12px var(--common-shadow);
}

</style>