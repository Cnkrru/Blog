<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { postEdit, publish, update, history } from '../../composables/pamin/post.ts'
import Calendar from '../icon/Calendar.vue'
import RefreshCw from '../icon/RefreshCw.vue'
import Clock from '../icon/Clock.vue'

const route = useRoute()
const postKey = String(route.params.id)

onMounted(() => postEdit(postKey))
</script>

<template>
  <div class="edit-area">
    <!-- 发布时间 -->
    <div class="publish-time">
      <Calendar class="calendar-icon" />
      <div class="pulish-info">
        <span>发布</span>
        <!-- 模板原绑定 date（未导入），发布日数据在 post.ts 的 publish 上 -->
        <span>{{ publish }}</span>
      </div>
    </div>
    <!-- 更新时间 -->
    <div class="update-time">
      <RefreshCw class="refresh-icon" />
      <div class="update-info">
        <span>更新于</span>
        <span>{{ update }}</span>
      </div>
    </div>
  </div>

  <!-- 更新记录改运行期：有 history 才渲染，编译期不再追加到正文末尾 -->
  <div v-if="history.length" class="history-area">
    <div class="history-head">
      <Clock class="history-icon" />
      <span>更新记录</span>
    </div>
    <ul class="history-list">
      <li v-for="(h, i) in history" :key="i" class="history-item">
        <time v-if="h.date">{{ h.date }}</time>
        <span>{{ h.text }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.edit-area {
  width: 100%;
  height: fit-content;

  display: flex;
  align-items: center;
  gap: var(--space-md);

  padding: var(--space-sm) var(--space-md);
  border: 1px solid color-mix(in srgb, var(--g-color) 30%, transparent);
  border-radius: var(--radius-md);
  margin: var(--space-sm) 0;
  box-sizing: border-box;

  background: color-mix(in srgb, var(--g-color) 20%, transparent);
  color: var(--g-text);
}

.publish-time,
.update-time {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-shrink: 0;
}

.calendar-icon {
  width: 32px;
  height: 32px;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 8px;
  color: var(--g-color);
  background: color-mix(in srgb, var(--g-color) 12%, transparent);
}

.refresh-icon {
  width: 32px;
  height: 32px;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 8px;
  color: var(--g-color);
  background: color-mix(in srgb, var(--g-color) 8%, transparent);
}

.pulish-info,
.update-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.pulish-info span:first-child,
.update-info span:first-child {
  font-size: 11px;
  opacity: 0.5;
  line-height: 1;
}

.pulish-info span:last-child,
.update-info span:last-child {
  font-size: 13px;
  font-weight: 600;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  color: var(--g-color); /* 日期数值改主色，对齐 status 统计数值配色 */
  line-height: 1;
}

.update-time {
  margin-left: auto;
}

/* 更新记录(运行期)：与日期条同款毛玻璃卡片，放在其下方 */
.history-area {
  margin: var(--space-sm) 0;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid color-mix(in srgb, var(--g-color) 30%, transparent);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--g-color) 20%, transparent);
  color: var(--g-text);
  box-sizing: border-box;
}

.history-head {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 13px;
  font-weight: 600;
  color: var(--g-color);
}

.history-icon {
  width: 28px;
  height: 28px;
  padding: 6px;
  box-sizing: border-box;
  border-radius: 8px;
  color: var(--g-color);
  background: color-mix(in srgb, var(--g-color) 10%, transparent);
}

.history-count {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  opacity: 0.6;
}

.history-list {
  margin: var(--space-sm) 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.history-item {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  font-size: 13px;
  line-height: 1.6;
}

.history-item time {
  flex-shrink: 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  color: var(--g-color);
  opacity: 0.7;
}

.history-item span {
  color: var(--g-text);
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
  /* [响应式-lg] 大屏 */
}

@media (max-width: 1024px) {
  /* [响应式-md] 平板 */
}

@media (max-width: 768px) {
  /* [响应式-sm] 手机：日期条内边距与图标收紧，保持发布/更新并排 */
  .edit-area {
    gap: var(--space-sm);
    padding: var(--space-sm);
  }
  .calendar-icon,
  .refresh-icon {
    width: 28px;
    height: 28px;
    padding: 7px;
  }
}

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏：发布与更新时间纵向堆叠，更新记录条目日期与说明换行，避免窄屏挤压 */
  .edit-area {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
  }
  .publish-time,
  .update-time {
    width: 100%;
  }
  .update-time {
    margin-left: 0;
  }
  .history-item {
    flex-direction: column;
    gap: 2px;
  }
}
</style>
