<script setup>
</script>

<template>
    <div class="welcome">欢迎来到我的博客</div>
</template>

<style scoped>
.welcome {
    width: 90%;
    height: fit-content;
    margin: var(--space-xs) auto;
    text-align: center;

    font-size: 14px;
    font-style: italic;
    font-family: "Microsoft YaHei", sans-serif;
    line-height: normal;
    color: var(--g-color);

    cursor: pointer;
    user-select: none;    
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