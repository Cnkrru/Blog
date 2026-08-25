<script setup>
/**
 * TocTreeItem - 递归TOC树节点组件
 * 用于渲染无限层级的文章目录树
 */
defineOptions({ name: 'TocTreeItem' })
import chevronRightSvg from '@/assets/svg/chevron-right.svg?raw'

const props = defineProps(['node', 'activeId', 'collapsedSet', 'depth'])

const emit = defineEmits(['click', 'toggle'])

const isActive = () => props.node.id === props.activeId
const isCollapsed = () => props.collapsedSet.has(props.node.id)
const hasChildren = () => !!(props.node.children && props.node.children.length > 0)
</script>

<template>
  <li
    class="toc-item"
    :class="[
      `lv-${node.level}`,
      { active: isActive(), collapsed: isCollapsed(), 'has-children': hasChildren() }
    ]"
  >
    <a
      class="toc-link"
      href="#"
      @click.prevent="emit('click', node.id)"
    >
      <!-- 展开/折叠箭头 -->
      <span
        v-if="hasChildren()"
        class="toc-arrow"
        @click.prevent.stop="emit('toggle', node.id)"
      >
        <span class="svg-icon toc-icon" :class="{ rot: !isCollapsed() }" :style="{ width: '10px', height: '10px' }" v-html="chevronRightSvg"></span>
      </span>
      <span v-else class="toc-holder"></span>

      <!-- 标题序号 -->
      <span v-if="node.numbering" class="toc-num">{{ node.numbering }}</span>

      <!-- 标题文本 -->
      <span class="toc-text">{{ node.text }}</span>
    </a>

    <!-- 子节点折叠容器 -->
    <div
      v-if="hasChildren()"
      class="toc-childwrap"
      :class="{ collapsed: isCollapsed() }"
    >
      <ul
        v-if="!isCollapsed()"
        class="toc-children"
      >
        <TocTreeItem
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :active-id="activeId"
          :collapsed-set="collapsedSet"
          :depth="depth + 1"
          @click="emit('click', $event)"
          @toggle="emit('toggle', $event)"
        />
      </ul>
    </div>
  </li>
</template>

<style scoped>
/* ========== 目录项 ========== */
.toc-item {
  position: relative;
  list-style: none;
}

/* ========== 链接行 ========== */
.toc-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px 5px 0;
  text-decoration: none;
  color: var(--common-text);
  font-size: 13px;
  line-height: 1.5;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
  transition: color 0.15s ease, background-color 0.15s ease;
  position: relative;
  z-index: 1;
  min-height: 28px;
}

.toc-link:hover {
  color: color-mix(in srgb, var(--common-color-1) 70%, var(--common-text));
  background: color-mix(in srgb, var(--common-text) 4%, transparent);
}

/* 活跃项 */
.toc-item.active > .toc-link {
  color: var(--common-color-1);
  font-weight: 500;
  background: color-mix(in srgb, var(--common-color-1) 6%, transparent);
}

/* ========== 层级缩进 ========== */
.lv-1 > .toc-link { padding-left: 16px; }
.lv-2 > .toc-link { padding-left: 28px; }
.lv-3 > .toc-link { padding-left: 40px; }
.lv-4 > .toc-link { padding-left: 52px; }
.lv-5 > .toc-link { padding-left: 64px; }
.lv-6 > .toc-link { padding-left: 76px; }

/* ========== 层级指示线（左侧竖线） ========== */
.toc-item {
  border-left: 1px solid color-mix(in srgb, var(--common-text) 10%, transparent);
  margin-left: 0;
}

.toc-item.active {
  border-left-color: var(--common-color-1);
  border-left-width: 2.5px;
}

/* 子项缩进指示线 */
.toc-item .toc-item {
  border-left-color: color-mix(in srgb, var(--common-text) 6%, transparent);
}

/* ========== 展开/折叠箭头 ========== */
.toc-arrow {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: var(--common-text);
  opacity: 0.35;
  transition: opacity 0.15s ease, color 0.15s ease;
  margin-left: -16px;
  position: absolute;
  left: 0;
}

.toc-arrow:hover {
  opacity: 0.8;
  color: var(--common-color-1);
}

.lv-1 .toc-arrow { left: 0; }
.lv-2 .toc-arrow { left: 12px; }
.lv-3 .toc-arrow { left: 24px; }
.lv-4 .toc-arrow { left: 36px; }
.lv-5 .toc-arrow { left: 48px; }
.lv-6 .toc-arrow { left: 60px; }

.toc-icon {
  transition: transform 0.2s ease;
  opacity: 0.7;
}

.toc-icon.rot {
  transform: rotate(90deg);
}

.toc-holder {
  width: 16px;
  flex-shrink: 0;
}

/* ========== 标题序号 ========== */
.toc-num {
  font-size: 10px;
  min-width: 18px;
  text-align: right;
  color: var(--common-text);
  opacity: 0.25;
  flex-shrink: 0;
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
}

.toc-item.active .toc-num {
  opacity: 0.6;
  color: var(--common-color-1);
}

/* ========== 标题文本 ========== */
.toc-text {
  flex: 1;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* ========== 子节点容器 ========== */
.toc-childwrap {
  overflow: hidden;
  transition: max-height 0.2s ease;
}

.toc-childwrap.collapsed {
  max-height: 0;
}

.toc-children {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>