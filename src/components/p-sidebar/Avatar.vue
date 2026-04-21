<script setup>
</script>

<template>
  <div class="avator-card">
    <img src="/src/assets/imgs/avator.jpg" alt="Cnkrru的头像">
  </div>
</template>

<style scoped>
/*==========头像样式==========*/
    /* 圆形头像卡片样式 */
.avator-card {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    transition: all 0.3s ease;
}

    /* 头像伪效果 */
.avator-card:hover {
    transform: translateY(1.1);
}

    /* 头像图片样式 */
.avator-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>

