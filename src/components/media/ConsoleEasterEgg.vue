<script setup>
import { onMounted } from 'vue'

const asciiArt = `
  =======    ====   ====    ==== ====    ==========      ==========      ====  ====
 //           ||\\\\   ||      ||  //      ||       ||     ||       ||      ||    ||
//            || \\\\  ||      || //       ||=========     ||=========      ||    ||
\\\\            ||  \\\\ ||      || \\\\       ||   \\\\         ||   \\\\          ||    ||
 \\\\           ||   \\\\||      ||  \\\\      ||    \\\\        ||    \\\\         \\\\    //
  =======    ====   ====    ==== ====   ====   ====     ====    ====       ======
`

onMounted(() => {
  console.log('%c' + asciiArt, 'color: #ff6b6b; font-weight: bold; font-size: 12px; line-height: 1.4;')
})
</script>

<template>
  <div class="console-egg">
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
.console-egg {
  display: none;
}
</style>

