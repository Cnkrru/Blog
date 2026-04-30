<script setup>
import { onMounted } from 'vue'

const asciiArt = `
  =======    ====   ====    ==== ====    ==========      ==========      ====  ====
 //           ||\\\\   ||      ||  //      ||       ||     ||       ||      ||    ||
//            || \\\\  ||      || //       ||=========     ||=========      ||    ||
\\\\            ||  \\\\ ||      || \\\\       ||   \\\\         ||   \\\\          ||    ||
 \\\\           ||   \\\\||      ||  \\\\      ||    \\\\        ||    \\\\         \\\\    //
  =======    ====   ====    ==== ====   ====   ====     ====    ====      ======
`

onMounted(() => {
  console.log('%c' + asciiArt, 'color: #ff6b6b; font-weight: bold; font-size: 12px; line-height: 1.4;')
})
</script>

<template>
  <div class="console-easter-egg">
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
.console-easter-egg {
  display: none;
}
</style>

<!-- 颜色样式 -->
<style scoped>
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>