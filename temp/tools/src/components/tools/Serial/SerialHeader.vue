<script setup>
</script>

<template>
  <div class="serial-header">
    <h1>串口工具</h1>
    <p class="serial-description">基于 Web Serial API 的串口调试工�?/p>
  </div>
</template>

<style>
.serial-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  color: white;
}

.serial-header h1 {
  font-size: 2.8rem;
  margin-bottom: 15px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.serial-description {
  font-size: 1.2rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .serial-header {
    padding: 20px;
  }
  
  .serial-header h1 {
    font-size: 2.2rem;
  }
  
  .serial-description {
    font-size: 1rem;
  }
}
</style>