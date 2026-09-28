<script setup>
// draft 工厂：hitmap() 内部持有热力图状态 ref，render() 提供交互方法
import { onMounted } from 'vue'
import { post } from '@/composables/pmain/post.js'
import { hitmap } from '@/composables/index.js'

// [AI迁移] hitmap 已成全局单例，且已去掉 render 壳：ui 直接指向单例，方法（init/toggleYear等）在单例上
const heat = hitmap
const ui = heat

// 解构到顶层：嵌套对象里的 ref 模板不会自动解包
const { years, months_data, selected_month, selected_year, open_year, open_month, days_data } = heat

const months = ['一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月']

// 选中月份的天数数组（setYear/setMonth 已写进 days_data，前端直接读）
const level_of = (day) => (day.activity >= 4 ? 4 : day.activity)

const load = async () => {
    const table = await post().data()   // 数据源统一走 draft/pmain/post.js 数据层
    ui.init(table)                               // 记账→years→setYear(最新一年)→定位最近活动月
}

onMounted(load)
</script>

<template>
    <div class="heatmap-wrapper">

        <div class="heatmap-header">
            <div class="custom-select">
                <button class="select-trigger" :class="{ active: open_year }"  @click="ui.toggleYear">
                    <span class="select-value">{{ selected_year }}年</span>
                    <span class="select-arrow" :class="{ rotated: open_year }"></span>
                </button>
                <transition name="dropdown">
                    <ul v-if="open_year" class="dropdown-menu" @click.stop>
                        <li
                            v-for="y in years" :key="y"
                            class="dropdown-item"
                            :class="{ active: y === selected_year }"
                            @click="ui.setYear(y)"
                        >{{ y }}年</li>
                    </ul>
                </transition>
            </div>

            <h3 class="heatmap-title">创作活动热力图</h3>

            <div class="custom-select">
                <button class="select-trigger" :class="{ active: open_month }" :disabled="isLoading" @click="ui.toggleMonth">
                    <span class="select-value">{{ months[selected_month - 1] }}</span>
                    <span class="select-arrow" :class="{ rotated: open_month }"></span>
                </button>
                <transition name="dropdown">
                    <ul v-if="open_month" class="dropdown-menu" @click.stop>
                        <li
                            v-for="(m, i) in months" :key="i"
                            class="dropdown-item"
                            :class="{ active: i + 1 === selected_month }"
                            @click="ui.setMonth(i + 1)"
                        >{{ m }}</li>
                    </ul>
                </transition>
            </div>
        </div>

        <div class="heatmap-content">
            <div v-if="days_data?.days?.length" class="heatmap-grid">
                <span
                    v-for="day in days_data.days" :key="day.date"
                    class="heatmap-cell"
                    :class="[ 'heatmap-lv' + level_of(day) ]"
                    :title="day.date + '：' + (day.activity > 0 ? day.activity + ' 次活动' : '无活动')"
                ></span>
            </div>
            <div v-else class="no-data">暂无数据</div>
        </div>

        <div class="heatmap-legend">
            <span class="legend-text">少</span>
            <div class="legend-cells">
                <div class="legend-cell heatmap-lv0"></div>
                <div class="legend-cell heatmap-lv1"></div>
                <div class="legend-cell heatmap-lv2"></div>
                <div class="legend-cell heatmap-lv3"></div>
                <div class="legend-cell heatmap-lv4"></div>
            </div>
            <span class="legend-text">多</span>
        </div>
    </div>
</template>

<style scoped>
/* ============================== 容器（透明，对齐blog-map） ============================== */
.heatmap-wrapper {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    position: relative;
    min-height: 200px;
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
}

/* ============================== Loading ============================== */
.loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
}

.loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid color-mix(in srgb, var(--g-text) 15%, transparent);
    border-top-color: var(--g-color);
    border-radius: 50%;
    margin-bottom: 10px;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-text {
    font-size: 13px;
    color: var(--g-text);
    opacity: 0.5;
}

.no-data {
    text-align: center;
    padding: 30px;
    font-size: 13px;
    color: var(--g-text);
    opacity: 0.4;
}

/* ============================== Header ============================== */
.heatmap-header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 12px;
}

.heatmap-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--g-text);
    margin: 0;
    opacity: 0.6;
}

/* ============================== 下拉 ============================== */
.custom-select {
    position: relative;
    flex-shrink: 0;
}

.select-trigger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    color: var(--g-text);
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
    border: 1px solid color-mix(in srgb, var(--g-text) 12%, transparent);
    backdrop-filter: blur(8px);
    transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.select-trigger:hover:not(:disabled) {
    border-color: var(--g-color);
    box-shadow: 0 2px 8px color-mix(in srgb, var(--g-color) 25%, transparent);
}

.select-trigger.active {
    border-color: var(--g-color);
    background: color-mix(in srgb, var(--g-color) 10%, transparent);
    box-shadow: 0 2px 8px color-mix(in srgb, var(--g-color) 30%, transparent);
}

.select-trigger:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.select-value {
    line-height: 1;
}

.select-arrow {
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid var(--g-text);
    transition: transform 0.2s ease;
    opacity: 0.6;
}

.select-arrow.rotated {
    transform: rotate(180deg);
    opacity: 1;
}

.dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 120px;
    max-height: 240px;
    overflow-y: auto;
    margin: 0;
    padding: 6px;
    list-style: none;
    border-radius: 12px;
    border: 1px solid color-mix(in srgb, var(--g-text) 12%, transparent);
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.92);
    backdrop-filter: blur(20px) saturate(180%);
    box-shadow: 0 8px 24px var(--g-shadow);
    z-index: 20;
}

.dropdown-item {
    padding: 7px 12px;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    color: var(--g-text);
    font-weight: 500;
    transition: background-color 0.15s ease, color 0.15s ease;
}

.dropdown-item:hover {
    background: color-mix(in srgb, var(--g-color) 12%, transparent);
}

.dropdown-item.active {
    background: var(--g-color);
    color: #fff;
    font-weight: 600;
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

/* ============================== 网格 ============================== */
.heatmap-content {
    width: 100%;
    display: flex;
    justify-content: center;
}

.heatmap-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    max-width: 360px;
    width: 100%;
}

.heatmap-cell {
    aspect-ratio: 1;
    border-radius: 6px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: transform 0.15s ease, border-color 0.15s ease;
}

.heatmap-cell:hover {
    transform: scale(1.25);
    border-color: var(--g-color);
    z-index: 1;
}

.heatmap-lv0 {
    background: color-mix(in srgb, var(--g-text) 6%, transparent);
    border-color: color-mix(in srgb, var(--g-text) 6%, transparent);
}

.heatmap-lv1 { background: var(--g-color); opacity: 0.25; }
.heatmap-lv2 { background: var(--g-color); opacity: 0.45; }
.heatmap-lv3 { background: var(--g-color); opacity: 0.65; }
.heatmap-lv4 { background: var(--g-color); opacity: 0.85; }

.heatmap-lv1:hover,
.heatmap-lv2:hover,
.heatmap-lv3:hover,
.heatmap-lv4:hover {
    opacity: 0.95;
}

/* ============================== 图例 ============================== */
.heatmap-legend {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 11px;
    color: var(--g-text);
    opacity: 0.5;
}

.legend-cells {
    display: flex;
    gap: 5px;
}

.legend-cell {
    width: 14px;
    height: 14px;
    border-radius: 4px;
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
    /* [响应式-lg] 大屏 */
}

@media (max-width: 1024px) {
    /* [响应式-md] 平板 */
    .heatmap-header { flex-wrap: wrap; }
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机 */
    .heatmap-wrapper { gap: 12px; width: 90%; }
    .heatmap-grid { gap: 4px; max-width: 100%; }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
    .select-trigger { padding: 4px 10px; font-size: 12px; }
    .dropdown-menu { font-size: 12px; }
    .heatmap-grid { gap: 3px; }
}

</style>