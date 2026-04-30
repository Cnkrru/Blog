<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="center-card-content">
    <div class="lose-center-card-content">
      <div class="lose-center-content">
        <h1>404 页面不存在</h1>
        <p>您访问的页面不存在，请检查URL是否正确</p>
        <button class="back-home-btn" @click="goHome">返回首页</button>
      </div>
    </div>
  </div>
  <hr>
</template>

<style scoped>
/* 布局样式 */
.center-card-content {
    padding: 40px 20px;
    text-align: center;
}

.lose-center-content {
    max-width: 600px;
    margin: 0 auto;
}

.lose-center-content h1 {
    font-size: 36px;
    margin-bottom: 20px;
}

.lose-center-content p {
    font-size: 18px;
    margin-bottom: 30px;
    line-height: 1.6;
}

.back-home-btn {
    display: inline-block;
    padding: 10px 20px;
    border: 1px solid;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
}

.back-home-btn:hover {
    transform: translateY(-3px);
}
</style>

<style scoped>
/* 颜色样式 */
.lose-center-content h1 {
    color: var(--common-text);
}

.lose-center-content p {
    color: var(--common-text);
}

.back-home-btn {
    background-color: var(--common-hover);
    color: var(--common-text);
    border-color: var(--common-color-1);
}

.back-home-btn:hover {
    background-color: var(--common-hover);
}
</style>

<style scoped>
/* 响应式设计媒体查询 */
@media (max-width: var(--md)) {
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

@media (max-width: var(--sm)) {
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
