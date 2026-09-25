<script setup>
import Question from '@/components/icon/Question.vue';
import ThumbsUp from '@/components/icon/ThumbsUp.vue';
import ThumbsDown from '@/components/icon/ThumbsDown.vue';

import { content } from '@/modules/content';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const route = useRoute()
const useful = content.useful_maker(route.params.id)

onMounted(() => {
    useful.use_btn_init()
})
</script>

<template>
    <div class="use-aera">
        <div class="use-box">
            <div class="use-question">
                <Question class="use-icon"/>
                <p>这篇文章对你有帮助吗?</p>
            </div>

            <div class="use-btn-list">
                <button class="use-btn-yes" @click="useful.use_btn_yes()">
                    <ThumbsUp class="use-icon"/>
                    <p>有用</p>
                </button>
                <button class="use-btn-no" @click="useful.use_btn_no()">
                    <ThumbsDown class="use-icon"/>
                    <p>没用</p>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.use-aera {
    width: 100%;
    height: fit-content;

    display: flex;
    justify-content: center;
    align-items: center;
}

.use-box {
    width: fit-content;
    height: fit-content;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: var(--space-md);

    padding: var(--space-lg) var(--space-xl);
    /* [AI对齐] 边框统一主色 25%，全站视觉一致 */
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
    border-radius: var(--radius-lg);
}

.use-question {
    width: fit-content;
    height: fit-content;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: var(--space-sm);
}

.use-question p {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: color-mix(in srgb, var(--g-text) 75%, transparent);
}

.use-icon {
    width: 18px;
    height: 18px;
    color: color-mix(in srgb, var(--g-text) 45%, transparent);
}

.use-btn-list {
    width: fit-content;
    height: fit-content;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: var(--space-md);
}

.use-btn-yes {
    width: fit-content;
    height: fit-content;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: var(--space-sm);

    padding: var(--space-sm) var(--space-lg);
    /* [AI对齐] 边框统一主色 25%，全站视觉一致 */
    border: 1.5px solid color-mix(in srgb, var(--g-color) 25%, transparent);
    border-radius: var(--radius-full);
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
    color: var(--g-text);

    cursor: pointer;
}

.use-btn-yes p {
    font-size: 14px;
    font-weight: 500;
    color: inherit;
}

.use-btn-no {
    width: fit-content;
    height: fit-content;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: var(--space-sm);

    padding: var(--space-sm) var(--space-lg);
    /* [AI对齐] 边框统一主色 25%，全站视觉一致 */
    border: 1.5px solid color-mix(in srgb, var(--g-color) 25%, transparent);
    border-radius: var(--radius-full);
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
    color: var(--g-text);

    cursor: pointer;
}

.use-btn-no p {
    font-size: 14px;
    font-weight: 500;
    color: inherit;
}

/* ==========<选中态>========== */
.use-btn-yes.use-yes {
    border-color: var(--color-success);
    color: var(--color-success);
    background: color-mix(in srgb, var(--color-success) 12%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-success) 8%, transparent);
}

.use-btn-no.use-no {
    border-color: var(--color-error);
    color: var(--color-error);
    background: color-mix(in srgb, var(--color-error) 12%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 8%, transparent);
}

.use-btn-yes.use-yes,
.use-btn-no.use-no {
    cursor: default;
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