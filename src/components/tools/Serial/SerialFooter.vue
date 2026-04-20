<script setup>
</script>

<template>
  <div class="serial-footer">
    <div class="footer-content">
      <div class="footer-info">
        <h3>Serial Tool</h3>
        <p>基于 Web Serial API 的串口调试工具</p>
      </div>
    </div>
    <div class="footer-copyright">
      <p>© 2026 Cnkrru's Blog | All Rights Reserved</p>
    </div>
  </div>
</template>

<style>
.serial-footer {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 30px;
  margin-top: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.footer-content {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.footer-info h3 {
  color: white;
  margin: 0 0 5px 0;
  font-size: 1.2rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.footer-info p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 14px;
}

.footer-copyright {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

@media (max-width: 768px) {
  .serial-footer {
    padding: 20px;
  }
  
  .footer-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .footer-links {
    width: 100%;
    justify-content: space-between;
  }
  
  .footer-links a {
    flex: 1;
    text-align: center;
  }
}
</style>