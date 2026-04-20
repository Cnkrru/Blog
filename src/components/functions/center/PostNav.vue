<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  prevPost: {
    type: Object,
    default: null
  },
  nextPost: {
    type: Object,
    default: null
  },
  scrollToTop: {
    type: Function,
    default: null
  }
})

const router = useRouter()

const navigateToPost = (postId) => {
  router.push(`/post/${postId}`)
}
</script>

<template>
  <div class="post-nav-container">
    <div @click="navigateToPost(prevPost.id)" v-if="prevPost" class="post-nav-btn prev">
      <div class="post-nav-btn-text">
        <span class="post-nav-btn-label">{{ t('previous') }}</span>
        <span class="post-nav-btn-title">{{ prevPost?.title || '暂无' }}</span>
      </div>
    </div>
    <div v-else class="post-nav-btn prev disabled">
      <div class="post-nav-btn-text">
        <span class="post-nav-btn-label">{{ t('previous') }}</span>
        <span class="post-nav-btn-title">暂无</span>
      </div>
    </div>
    <div @click="navigateToPost(nextPost.id)" v-if="nextPost" class="post-nav-btn next">
      <div class="post-nav-btn-text">
        <span class="post-nav-btn-label">{{ t('next') }}</span>
        <span class="post-nav-btn-title">{{ nextPost?.title || '暂无' }}</span>
      </div>
    </div>
    <div v-else class="post-nav-btn next disabled">
      <div class="post-nav-btn-text">
        <span class="post-nav-btn-label">{{ t('next') }}</span>
        <span class="post-nav-btn-title">暂无</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 上下篇导航按钮 */
.post-nav-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin: 30px 0;
}

.post-nav-btn {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 15px 20px;
    background-color: var(--card-bg);
    border: 2px solid var(--center-card-border-color);
    border-radius: 8px;
    color: var(--text-color);
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
}

.post-nav-btn:hover {
    border-color: var(--accent-fg);
    transform: translateY(-2px);
}

.post-nav-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.post-nav-btn.disabled:hover {
    border-color: var(--center-card-border-color);
    transform: none;
}

.post-nav-btn.prev {
    justify-content: flex-start;
}

.post-nav-btn.next {
    justify-content: flex-end;
}

.post-nav-btn-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.post-nav-btn-label {
    font-size: 12px;
    opacity: 0.8;
}

.post-nav-btn-title {
    font-size: 14px;
}

/*==============================响应式设计查询=============================*/
/* 超小屏手机76px) */
@media (max-width: 575.98px) {
    /* 调整上下篇导航按钮 */
    .post-nav-container {
        flex-direction: column;
        gap: 10px;
    }
    
    .post-nav-btn {
        padding: 12px 15px;
    }
    
    .post-nav-btn-label {
        font-size: 11px;
    }
    
    .post-nav-btn-title {
        font-size: 13px;
    }
}

/* 小屏手机横屏及以上 (76px) */
@media (min-width: 576px) {
    /* 调整上下篇导航按钮 */
    .post-nav-container {
        flex-direction: column;
        gap: 12px;
    }
    
    .post-nav-btn {
        padding: 13px 17px;
    }
    
    .post-nav-btn-label {
        font-size: 11.5px;
    }
    
    .post-nav-btn-title {
        font-size: 13.5px;
    }
}

/* 平板及以上 (768px) */
@media (min-width: 768px) {
    /* 恢复桌面布局 */
    .post-nav-container {
        flex-direction: row;
        gap: 20px;
    }
    
    .post-nav-btn {
        padding: 15px 20px;
    }
    
    .post-nav-btn-label {
        font-size: 12px;
    }
    
    .post-nav-btn-title {
        font-size: 14px;
    }
}
</style>
