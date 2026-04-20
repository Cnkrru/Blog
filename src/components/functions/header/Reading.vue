<script setup lang="ts">
const toggleImmersiveReading = () : void => {
  document.body.classList.toggle('immersive-reading');
}
</script>

<template>
  <div class="button-style immersive-reading-btn" @click="toggleImmersiveReading">
    <img src="../../../assets/imgs/svg/book.svg" alt="沉浸式阅读">
  </div>
</template>

