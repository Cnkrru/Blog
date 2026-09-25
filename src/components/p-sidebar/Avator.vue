<script setup>

</script>

<template>
    <div class="avator">
        <img src="@/assets/media/avator.webp" alt="Cnkrru的头像" loading="lazy" title="头像">
    </div>
</template>

<style scoped>
.avator {
    width: 100px;
    height: 100px;

    border: 3px solid var(--g-color);
    border-radius: var(--radius-full);
    margin-top: var(--space-md);

    overflow: hidden;

}

.avator img {
    width: 100%;
    height: 100%;
    
    object-fit: cover;
    transition: transform 0.6s ease-in-out;
}

.avator:hover img {
    transform: rotate(360deg);
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