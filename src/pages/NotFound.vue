<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

// 返回首页
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="center-card-content">
    <div class="lose-center-card-content">
      <div class="lose-center-content">
        <h1>{{ t('notFound.title') }}</h1>
        <p>{{ t('notFound.message') }}</p>
        <button class="back-home-btn" @click="goHome">{{ t('notFound.backHome') }}</button>
      </div>
    </div>
  </div>
  <hr>
</template>

<style scoped>
.center-card-content {
    padding: 40px 20px;
    text-align: center;
}

.lose-center-content {
    max-width: 600px;
    margin: 0 auto;
}

.lose-center-content h1 {
    color: var(--center-card-title-color);
    font-size: 36px;
    margin-bottom: 20px;
}

.lose-center-content p {
    color: var(--text-color);
    font-size: 18px;
    margin-bottom: 30px;
    line-height: 1.6;
}

.back-home-btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: var(--button-bg);
    color: var(--button-text);
    border: 1px solid var(--button-border);
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
}

.back-home-btn:hover {
    background-color: var(--button-hover-bg);
    transform: translateY(-3px);
}

/* 响应式设计媒体查询 */
@media (max-width: 768px) {
    .center-card-content {
        padding: 30px 15px;
    }
    
    .lose-center-content h1 {
        font-size: 28px;
        margin-bottom: 15px;
    }
    
    .lose-center-content p {
        font-size: 16px;
        margin-bottom: 25px;
    }
    
    .back-home-btn {
        padding: 8px 16px;
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .center-card-content {
        padding: 20px 10px;
    }
    
    .lose-center-content h1 {
        font-size: 24px;
        margin-bottom: 12px;
    }
    
    .lose-center-content p {
        font-size: 14px;
        margin-bottom: 20px;
    }
    
    .back-home-btn {
        padding: 6px 12px;
        font-size: 12px;
    }
}
</style>
