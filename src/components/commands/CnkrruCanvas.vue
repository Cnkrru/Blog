<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['complete'])

const text = 'Cnkrru'

onMounted(() => {
  if (props.show) {
    startAnimation()
  }
})

watch(() => props.show, (newShow) => {
  if (newShow) {
    startAnimation()
  }
})

const startAnimation = () => {
  setTimeout(() => {
    emit('complete')
  }, 3000)
}
</script>

<template>
  <div v-if="show" class="cnkrru-effect">
    <div class="cnkrru-text">
      Cnkrru
    </div>
  </div>
</template>

<style scoped>
.cnkrru-effect {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  pointer-events: none;
  transform: translateZ(1000px);
  backface-visibility: hidden;
}

.cnkrru-text {
  font-size: 120px;
  font-weight: 800;
  letter-spacing: 10px;
  text-align: center;
  background: var(--logo-gradient);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

@media (max-width: 768px) {
  .cnkrru-text {
    font-size: 80px;
    letter-spacing: 5px;
  }
}

@media (max-width: 480px) {
  .cnkrru-text {
    font-size: 50px;
    letter-spacing: 3px;
  }
}
</style>
