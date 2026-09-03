<script setup>
</script>

<template>
    <div class="avator-card">
        <img src="/src/assets/imgs/avator.jpg" alt="Cnkrru的头像" loading="lazy" title="头像">
    </div>
</template>

<style scoped>
.avator-card {
    width: 100px;
    height: 100px;

    border: 3px solid var(--common-color-1);
    border-radius: 50%;

    overflow: hidden;

}

.avator-card img {
    width: 100%;
    height: 100%;
    
    object-fit: cover;
    transition: transform 0.6s ease-in-out;
}

.avator-card:hover img {
    transform: rotate(360deg);
}
</style>