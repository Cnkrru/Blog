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

<style scoped>
.console-easter-egg {
  display: none;
}
</style>