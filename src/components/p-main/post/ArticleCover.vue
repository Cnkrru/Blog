<script setup>
// [AI实现] 对接列表页真数据：接收单篇meta，替代原测试数据
import { computed } from 'vue';
const props = defineProps({
    article: {
        type: Object,
        default: () => ({})
    }
})
const info_title = computed(() => props.article.title ?? '')
const info_date = computed(() => props.article.date ?? '')
const info_categories = computed(() => props.article.category ?? '')
const info_tag = computed(() => props.article.tags?.[0] ?? '')


</script>

<template>
    <div class="cover">
        <!-- 图形区域 -->
        <div class="cover-circle circle-1"></div>
        <div class="cover-circle circle-2"></div>
        <div class="cover-circle circle-3"></div>
        <div class="cover-line"></div>
        <!-- 数据区域 -->
        <div class="info">
            <div class="info-categories">{{ info_categories }}</div>
            <div class="info-title">{{ info_title }}</div>
            <div class="info-tag">{{ info_tag }}</div>
            <div class="info-date">{{ info_date }}</div>
        </div>
    </div>
</template>

<style scoped>
.cover {
    width: 100%;
    aspect-ratio: 1.91 / 1;

    position: relative;      
    overflow: hidden;        

    display: flex;
    align-items: flex-end;   

    border: 3px solid var(--g-color);
    border-radius: var(--space-lg);

    background-image: linear-gradient(
        135deg,
        color-mix(in srgb, var(--g-bg) 95%, var(--g-color)) 0%,
        var(--g-bg) 50%,
        color-mix(in srgb, var(--g-bg) 90%, var(--g-color) 10%) 100%
    );
}

.cover-circle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
}

.circle-1 {
    width: 45%;             
    aspect-ratio: 1;         
    top: 0%;
    right: -8%;          
    background-color: color-mix(in srgb, var(--g-color) 8%, transparent);
}

.circle-2 {
    width: 30%;
    aspect-ratio: 1;
    bottom: -3%;
    left: -6%;
    background-color: color-mix(in srgb, var(--g-color) 6%, transparent);
}

.circle-3 {
    width: 20%;
    aspect-ratio: 1;
    top: 20%;               
    left: 50%;
    transform: translateX(-50%);   
    background-color: color-mix(in srgb, var(--g-color) 3%, transparent);
}

.cover-line {
    position: absolute;
    top: 4%;                 
    left: 2%;                
    width: 5%;               
    height: 3px;             
    border-radius: 2px;
    opacity: 0.7;
    background-color: var(--g-color);
}

.info {
    /* 声明为尺寸容器：子级用 cqw 单位，随卡片宽度等比缩放 */
    container-type: inline-size;

    width: 100%;
    position: relative;
    z-index: 1;

    padding: 5% 6%;

    display: flex;
    flex-direction: column;
    gap: clamp(8px, 1.2cqw, 18px);
}

.info-title {
    width: fit-content;
    height: fit-content;

    font-size: clamp(16px, 3cqw, 36px);
    font-weight: 700;
    line-height: 1.4;
    
    color: var(--g-text);
    
    margin: 0;

    line-clamp: 2;
    overflow: hidden;

    word-wrap: break-word;
    word-break: break-all;
}

.info-date {
    width: fit-content;
    height: fit-content;

    font-size: clamp(11px, 1.5cqw, 15px);
    
    opacity: 0.6;
    color: var(--g-text);
}

.info-categories {
    width: fit-content;
    height: fit-content;

    align-self: flex-start;
    
    padding: clamp(2px, 0.5cqw, 4px) clamp(8px, 1.3cqw, 16px);
    border-radius: 4px;
    
    font-size: clamp(10px, 1.5cqw, 16px);
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    
    opacity: 0.85;
    background-color: color-mix(in srgb, var(--g-color) 15%, transparent);
    color: var(--g-color);
}

.info-tag {
    width: fit-content;
    height: fit-content;

    padding: clamp(2px, 0.5cqw, 4px) clamp(8px, 1.3cqw, 16px);
    border: 1px solid color-mix(in srgb, var(--g-color) 25%, transparent);    
    border-radius: 12px;
    
    font-size: clamp(10px, 1.5cqw, 16px);
    font-weight: 500;

    background-color: color-mix(in srgb, var(--g-color) 12%, transparent);
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
    /* [响应式-sm] 手机 */
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
}

</style>
