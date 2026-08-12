import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useThemeStore } from './theme'
import giscusBaseCss from '@/assets/css/comment/giscus-base.css?raw'

// 8 套主题颜色定义，通过 Data URL 动态注入 CSS 变量，仅需一个 base CSS 文件
type ThemeKey = `${string}-${'dark' | 'light'}`
type ThemeVars = Record<string, string>

const themeColors: Record<ThemeKey, ThemeVars> = {
  // ========== ink ==========
  'ink-dark': {
    '--g-btn-text': 'rgba(245,241,232,0.92)',
    '--g-btn-bg': 'rgba(245,241,232,0.06)',
    '--g-btn-border': 'rgba(245,241,232,0.10)',
    '--g-btn-hover-bg': 'rgba(245,241,232,0.10)',
    '--g-btn-hover-border': 'rgba(245,241,232,0.16)',
    '--g-btn-active-bg': 'rgba(245,241,232,0.08)',
    '--g-btn-active-border': 'rgba(245,241,232,0.12)',
    '--g-btn-selected-bg': 'rgba(196,68,56,0.14)',
    '--g-btn-primary-text': '#fff',
    '--g-btn-primary-bg': 'rgba(196,68,56,0.88)',
    '--g-btn-primary-border': 'rgba(196,68,56,0.88)',
    '--g-btn-primary-shadow': '0 1px 2px rgba(0,0,0,0.12)',
    '--g-btn-primary-inset-shadow': 'inset 0 0 0 1px rgba(255,255,255,0.12)',
    '--g-btn-primary-hover-bg': '#d65a4e',
    '--g-btn-primary-hover-border': '#d65a4e',
    '--g-btn-primary-selected-bg': 'rgba(196,68,56,0.92)',
    '--g-btn-primary-selected-shadow': 'inset 0 1px 2px rgba(0,0,0,0.16)',
    '--g-btn-primary-disabled-text': 'rgba(255,255,255,0.32)',
    '--g-btn-primary-disabled-bg': 'rgba(196,68,56,0.22)',
    '--g-btn-primary-disabled-border': 'rgba(196,68,56,0.16)',
    '--g-action-list-hover-bg': 'rgba(245,241,232,0.04)',
    '--g-segmented-bg': 'rgba(245,241,232,0.04)',
    '--g-segmented-btn-bg': '#2e2a22',
    '--g-segmented-btn-border': 'rgba(245,241,232,0.10)',
    '--g-fg-default': 'rgba(245,241,232,0.92)',
    '--g-fg-muted': 'rgba(245,241,232,0.48)',
    '--g-fg-subtle': 'rgba(245,241,232,0.30)',
    '--g-canvas-default': 'rgba(46,42,34,0.72)',
    '--g-canvas-overlay': 'rgba(46,42,34,0.94)',
    '--g-canvas-inset': 'rgba(245,241,232,0.03)',
    '--g-canvas-subtle': 'rgba(245,241,232,0.03)',
    '--g-border-default': 'rgba(245,241,232,0.10)',
    '--g-border-muted': 'rgba(245,241,232,0.05)',
    '--g-neutral-muted': 'rgba(245,241,232,0.08)',
    '--g-accent-fg': '#c44438',
    '--g-accent-emphasis': '#c44438',
    '--g-accent-muted': 'rgba(196,68,56,0.28)',
    '--g-accent-subtle': 'rgba(196,68,56,0.09)',
    '--g-scale-gray-7': 'rgba(245,241,232,0.05)',
    '--g-scale-blue-8': 'rgba(196,68,56,0.16)',
    '--g-social-reaction-bg-hover': 'var(--g-scale-gray-7)',
    '--g-social-reaction-bg-reacted-hover': 'var(--g-scale-blue-8)',
    '--g-hover-shadow': '0 2px 8px rgba(0,0,0,0.22)',
    '--g-box-shadow': '0 1px 2px rgba(0,0,0,0.16)',
    '--g-textarea-bg': 'rgba(245,241,232,0.05)',
    '--g-textarea-border': 'rgba(245,241,232,0.10)',
    '--g-textarea-color': 'rgba(245,241,232,0.92)',
    '--g-textarea-focus-border': 'rgba(196,68,56,0.5)',
    '--g-textarea-focus-shadow': '0 0 0 3px rgba(196,68,56,0.12)',
    '--g-comment-bg': 'rgba(245,241,232,0.04)',
    '--g-comment-border': 'rgba(245,241,232,0.05)',
    '--g-header-border': 'rgba(245,241,232,0.06)',
  },
  'ink-light': {
    '--g-btn-text': '#3a362e',
    '--g-btn-bg': '#fbf8f0',
    '--g-btn-border': 'rgba(74,60,40,0.14)',
    '--g-btn-shadow': '0 1px 2px rgba(74,60,40,0.05)',
    '--g-btn-inset-shadow': 'inset 0 0 0 1px rgba(255,255,255,0.5)',
    '--g-btn-hover-bg': '#f3ecdc',
    '--g-btn-hover-border': 'rgba(74,60,40,0.22)',
    '--g-btn-active-bg': '#ede6d4',
    '--g-btn-active-border': 'rgba(74,60,40,0.24)',
    '--g-btn-selected-bg': 'rgba(168,51,42,0.10)',
    '--g-btn-primary-text': '#fff',
    '--g-btn-primary-bg': 'rgba(168,51,42,0.88)',
    '--g-btn-primary-border': 'rgba(168,51,42,0.88)',
    '--g-btn-primary-shadow': '0 1px 2px rgba(74,60,40,0.08)',
    '--g-btn-primary-inset-shadow': 'inset 0 0 0 1px rgba(255,255,255,0.25)',
    '--g-btn-primary-hover-bg': '#c44438',
    '--g-btn-primary-hover-border': '#c44438',
    '--g-btn-primary-selected-bg': 'rgba(168,51,42,0.92)',
    '--g-btn-primary-selected-shadow': 'inset 0 1px 2px rgba(74,60,40,0.10)',
    '--g-btn-primary-disabled-text': 'rgba(255,255,255,0.45)',
    '--g-btn-primary-disabled-bg': 'rgba(168,51,42,0.30)',
    '--g-btn-primary-disabled-border': 'rgba(168,51,42,0.20)',
    '--g-action-list-hover-bg': 'rgba(74,60,40,0.05)',
    '--g-segmented-bg': 'rgba(74,60,40,0.05)',
    '--g-segmented-btn-bg': '#fbf8f0',
    '--g-segmented-btn-border': 'rgba(74,60,40,0.14)',
    '--g-fg-default': '#1a1a1a',
    '--g-fg-muted': 'rgba(26,26,26,0.55)',
    '--g-fg-subtle': 'rgba(26,26,26,0.32)',
    '--g-canvas-default': 'rgba(251,248,240,0.82)',
    '--g-canvas-overlay': 'rgba(251,248,240,0.96)',
    '--g-canvas-inset': 'rgba(74,60,40,0.03)',
    '--g-canvas-subtle': 'rgba(74,60,40,0.03)',
    '--g-border-default': 'rgba(74,60,40,0.12)',
    '--g-border-muted': 'rgba(74,60,40,0.06)',
    '--g-neutral-muted': 'rgba(74,60,40,0.08)',
    '--g-accent-fg': '#a8332a',
    '--g-accent-emphasis': '#a8332a',
    '--g-accent-muted': 'rgba(168,51,42,0.22)',
    '--g-accent-subtle': 'rgba(168,51,42,0.07)',
    '--g-scale-gray-1': 'rgba(74,60,40,0.05)',
    '--g-scale-blue-1': 'rgba(168,51,42,0.10)',
    '--g-scale-gray-7': 'rgba(74,60,40,0.05)',
    '--g-scale-blue-8': 'rgba(168,51,42,0.10)',
    '--g-social-reaction-bg-hover': 'var(--g-scale-gray-7)',
    '--g-social-reaction-bg-reacted-hover': 'var(--g-scale-blue-1)',
    '--g-hover-shadow': '0 2px 8px rgba(74,60,40,0.08)',
    '--g-box-shadow': '0 1px 2px rgba(74,60,40,0.04)',
    '--g-textarea-bg': 'rgba(251,248,240,0.6)',
    '--g-textarea-border': 'rgba(74,60,40,0.12)',
    '--g-textarea-focus-border': 'rgba(168,51,42,0.5)',
    '--g-textarea-focus-shadow': '0 0 0 3px rgba(168,51,42,0.12)',
    '--g-comment-bg': 'rgba(251,248,240,0.55)',
    '--g-comment-border': 'rgba(74,60,40,0.06)',
    '--g-header-border': 'rgba(74,60,40,0.08)',
    '--g-primer-shadow-inset': 'inset 0 1px 0 rgba(74,60,40,0.04)',
  },
  // ========== sakura ==========
  'sakura-dark': {
    '--g-btn-text': 'rgba(255,255,255,0.9)',
    '--g-btn-bg': 'rgba(255,255,255,0.06)',
    '--g-btn-border': 'rgba(255,255,255,0.1)',
    '--g-btn-hover-bg': 'rgba(255,255,255,0.1)',
    '--g-btn-hover-border': 'rgba(255,255,255,0.15)',
    '--g-btn-active-bg': 'rgba(255,255,255,0.08)',
    '--g-btn-active-border': 'rgba(255,255,255,0.12)',
    '--g-btn-selected-bg': 'rgba(58,170,231,0.12)',
    '--g-btn-primary-text': '#fff',
    '--g-btn-primary-bg': 'rgba(58,170,231,0.85)',
    '--g-btn-primary-border': 'rgba(58,170,231,0.85)',
    '--g-btn-primary-shadow': '0 1px 2px rgba(0,0,0,0.1)',
    '--g-btn-primary-inset-shadow': 'inset 0 0 0 1px rgba(255,255,255,0.1)',
    '--g-btn-primary-hover-bg': '#3aaae7',
    '--g-btn-primary-hover-border': '#3aaae7',
    '--g-btn-primary-selected-bg': 'rgba(58,170,231,0.9)',
    '--g-btn-primary-selected-shadow': 'inset 0 1px 2px rgba(0,0,0,0.15)',
    '--g-btn-primary-disabled-text': 'rgba(255,255,255,0.3)',
    '--g-btn-primary-disabled-bg': 'rgba(58,170,231,0.2)',
    '--g-btn-primary-disabled-border': 'rgba(58,170,231,0.15)',
    '--g-action-list-hover-bg': 'rgba(255,255,255,0.04)',
    '--g-segmented-bg': 'rgba(255,255,255,0.04)',
    '--g-segmented-btn-bg': '#15103a',
    '--g-segmented-btn-border': 'rgba(255,255,255,0.1)',
    '--g-fg-default': 'rgba(255,255,255,0.9)',
    '--g-fg-muted': 'rgba(255,255,255,0.45)',
    '--g-fg-subtle': 'rgba(255,255,255,0.3)',
    '--g-canvas-default': 'rgba(21,7,60,0.5)',
    '--g-canvas-overlay': 'rgba(21,7,60,0.88)',
    '--g-canvas-inset': 'rgba(255,255,255,0.03)',
    '--g-canvas-subtle': 'rgba(255,255,255,0.03)',
    '--g-border-default': 'rgba(255,255,255,0.08)',
    '--g-border-muted': 'rgba(255,255,255,0.04)',
    '--g-neutral-muted': 'rgba(110,118,129,0.2)',
    '--g-accent-fg': '#3aaae7',
    '--g-accent-emphasis': '#3aaae7',
    '--g-accent-muted': 'rgba(58,170,231,0.3)',
    '--g-accent-subtle': 'rgba(58,170,231,0.08)',
    '--g-scale-gray-7': 'rgba(255,255,255,0.04)',
    '--g-scale-blue-8': 'rgba(58,170,231,0.15)',
    '--g-social-reaction-bg-hover': 'var(--g-scale-gray-7)',
    '--g-social-reaction-bg-reacted-hover': 'var(--g-scale-blue-8)',
    '--g-hover-shadow': '0 2px 8px rgba(0,0,0,0.2)',
    '--g-box-shadow': '0 1px 2px rgba(0,0,0,0.04)',
    '--g-textarea-bg': 'rgba(255,255,255,0.04)',
    '--g-textarea-border': 'rgba(255,255,255,0.1)',
    '--g-textarea-color': 'rgba(255,255,255,0.9)',
    '--g-textarea-focus-border': 'rgba(58,170,231,0.5)',
    '--g-textarea-focus-shadow': '0 0 0 3px rgba(58,170,231,0.12)',
    '--g-comment-bg': 'rgba(255,255,255,0.03)',
    '--g-comment-border': 'rgba(255,255,255,0.04)',
    '--g-header-border': 'rgba(255,255,255,0.06)',
  },
  'sakura-light': {
    '--g-btn-text': '#333',
    '--g-btn-bg': '#fff',
    '--g-btn-border': 'rgba(0,0,0,0.12)',
    '--g-btn-shadow': '0 1px 2px rgba(0,0,0,0.04)',
    '--g-btn-inset-shadow': 'inset 0 0 0 1px rgba(255,255,255,0.5)',
    '--g-btn-hover-bg': '#f8f8f8',
    '--g-btn-hover-border': 'rgba(0,0,0,0.18)',
    '--g-btn-active-bg': '#f0f0f0',
    '--g-btn-active-border': 'rgba(0,0,0,0.2)',
    '--g-btn-selected-bg': 'rgba(255,192,203,0.15)',
    '--g-btn-primary-text': '#333',
    '--g-btn-primary-bg': 'rgba(255,192,203,0.85)',
    '--g-btn-primary-border': 'rgba(255,192,203,0.85)',
    '--g-btn-primary-shadow': '0 1px 2px rgba(0,0,0,0.06)',
    '--g-btn-primary-inset-shadow': 'inset 0 0 0 1px rgba(255,255,255,0.3)',
    '--g-btn-primary-hover-bg': 'rgba(255,192,203,1)',
    '--g-btn-primary-hover-border': 'rgba(255,192,203,1)',
    '--g-btn-primary-selected-bg': 'rgba(255,192,203,0.9)',
    '--g-btn-primary-selected-shadow': 'inset 0 1px 2px rgba(0,0,0,0.08)',
    '--g-btn-primary-disabled-text': 'rgba(51,51,51,0.4)',
    '--g-btn-primary-disabled-bg': 'rgba(255,192,203,0.3)',
    '--g-btn-primary-disabled-border': 'rgba(255,192,203,0.2)',
    '--g-action-list-hover-bg': 'rgba(0,0,0,0.04)',
    '--g-segmented-bg': 'rgba(0,0,0,0.04)',
    '--g-segmented-btn-bg': '#fff',
    '--g-segmented-btn-border': 'rgba(0,0,0,0.12)',
    '--g-fg-default': '#333',
    '--g-fg-muted': 'rgba(51,51,51,0.5)',
    '--g-fg-subtle': 'rgba(51,51,51,0.3)',
    '--g-canvas-default': 'rgba(255,255,255,0.6)',
    '--g-canvas-overlay': 'rgba(255,255,255,0.9)',
    '--g-canvas-inset': 'rgba(0,0,0,0.02)',
    '--g-canvas-subtle': 'rgba(0,0,0,0.02)',
    '--g-border-default': 'rgba(0,0,0,0.08)',
    '--g-border-muted': 'rgba(0,0,0,0.04)',
    '--g-neutral-muted': 'rgba(175,184,193,0.2)',
    '--g-accent-fg': 'rgba(255,192,203,1)',
    '--g-accent-emphasis': 'rgba(255,192,203,1)',
    '--g-accent-muted': 'rgba(255,192,203,0.3)',
    '--g-accent-subtle': 'rgba(255,192,203,0.08)',
    '--g-scale-gray-7': 'rgba(0,0,0,0.04)',
    '--g-scale-blue-8': 'rgba(255,192,203,0.1)',
    '--g-social-reaction-bg-hover': 'var(--g-scale-gray-7)',
    '--g-social-reaction-bg-reacted-hover': 'var(--g-scale-blue-8)',
    '--g-hover-shadow': '0 2px 8px rgba(0,0,0,0.06)',
    '--g-box-shadow': '0 1px 2px rgba(0,0,0,0.04)',
    '--g-textarea-bg': 'rgba(255,255,255,0.55)',
    '--g-textarea-border': 'rgba(0,0,0,0.08)',
    '--g-textarea-focus-border': 'rgba(255,192,203,0.5)',
    '--g-textarea-focus-shadow': '0 0 0 3px rgba(255,192,203,0.12)',
    '--g-comment-bg': 'rgba(255,255,255,0.4)',
    '--g-comment-border': 'rgba(0,0,0,0.04)',
    '--g-header-border': 'rgba(0,0,0,0.06)',
    '--g-primer-shadow-inset': 'inset 0 1px 0 rgba(0,0,0,0.04)',
  },
  // ========== purple ==========
  'purple-dark': {
    '--g-btn-text': 'rgba(232,224,240,0.92)',
    '--g-btn-bg': 'rgba(232,224,240,0.06)',
    '--g-btn-border': 'rgba(232,224,240,0.10)',
    '--g-btn-hover-bg': 'rgba(232,224,240,0.10)',
    '--g-btn-hover-border': 'rgba(232,224,240,0.16)',
    '--g-btn-active-bg': 'rgba(232,224,240,0.08)',
    '--g-btn-active-border': 'rgba(232,224,240,0.12)',
    '--g-btn-selected-bg': 'rgba(167,139,250,0.14)',
    '--g-btn-primary-text': '#fff',
    '--g-btn-primary-bg': 'rgba(167,139,250,0.88)',
    '--g-btn-primary-border': 'rgba(167,139,250,0.88)',
    '--g-btn-primary-shadow': '0 1px 2px rgba(0,0,0,0.12)',
    '--g-btn-primary-inset-shadow': 'inset 0 0 0 1px rgba(255,255,255,0.12)',
    '--g-btn-primary-hover-bg': '#b8a0fa',
    '--g-btn-primary-hover-border': '#b8a0fa',
    '--g-btn-primary-selected-bg': 'rgba(167,139,250,0.92)',
    '--g-btn-primary-selected-shadow': 'inset 0 1px 2px rgba(0,0,0,0.16)',
    '--g-btn-primary-disabled-text': 'rgba(255,255,255,0.32)',
    '--g-btn-primary-disabled-bg': 'rgba(167,139,250,0.22)',
    '--g-btn-primary-disabled-border': 'rgba(167,139,250,0.16)',
    '--g-action-list-hover-bg': 'rgba(232,224,240,0.04)',
    '--g-segmented-bg': 'rgba(232,224,240,0.04)',
    '--g-segmented-btn-bg': '#1e1035',
    '--g-segmented-btn-border': 'rgba(232,224,240,0.10)',
    '--g-fg-default': 'rgba(232,224,240,0.92)',
    '--g-fg-muted': 'rgba(232,224,240,0.48)',
    '--g-fg-subtle': 'rgba(232,224,240,0.30)',
    '--g-canvas-default': 'rgba(30,16,53,0.72)',
    '--g-canvas-overlay': 'rgba(30,16,53,0.94)',
    '--g-canvas-inset': 'rgba(232,224,240,0.03)',
    '--g-canvas-subtle': 'rgba(232,224,240,0.03)',
    '--g-border-default': 'rgba(232,224,240,0.10)',
    '--g-border-muted': 'rgba(232,224,240,0.05)',
    '--g-neutral-muted': 'rgba(232,224,240,0.08)',
    '--g-accent-fg': '#a78bfa',
    '--g-accent-emphasis': '#a78bfa',
    '--g-accent-muted': 'rgba(167,139,250,0.28)',
    '--g-accent-subtle': 'rgba(167,139,250,0.09)',
    '--g-scale-gray-7': 'rgba(232,224,240,0.05)',
    '--g-scale-blue-8': 'rgba(167,139,250,0.16)',
    '--g-social-reaction-bg-hover': 'var(--g-scale-gray-7)',
    '--g-social-reaction-bg-reacted-hover': 'var(--g-scale-blue-8)',
    '--g-hover-shadow': '0 2px 8px rgba(0,0,0,0.22)',
    '--g-box-shadow': '0 1px 2px rgba(0,0,0,0.16)',
    '--g-textarea-bg': 'rgba(232,224,240,0.05)',
    '--g-textarea-border': 'rgba(232,224,240,0.10)',
    '--g-textarea-color': 'rgba(232,224,240,0.92)',
    '--g-textarea-focus-border': 'rgba(167,139,250,0.5)',
    '--g-textarea-focus-shadow': '0 0 0 3px rgba(167,139,250,0.12)',
    '--g-comment-bg': 'rgba(232,224,240,0.04)',
    '--g-comment-border': 'rgba(232,224,240,0.05)',
    '--g-header-border': 'rgba(232,224,240,0.06)',
  },
  'purple-light': {
    '--g-btn-text': '#2d1b4e',
    '--g-btn-bg': '#f5f0ff',
    '--g-btn-border': 'rgba(45,27,78,0.12)',
    '--g-btn-shadow': '0 1px 2px rgba(45,27,78,0.05)',
    '--g-btn-inset-shadow': 'inset 0 0 0 1px rgba(255,255,255,0.5)',
    '--g-btn-hover-bg': '#ede6f7',
    '--g-btn-hover-border': 'rgba(45,27,78,0.20)',
    '--g-btn-active-bg': '#e6ddf0',
    '--g-btn-active-border': 'rgba(45,27,78,0.22)',
    '--g-btn-selected-bg': 'rgba(139,92,246,0.10)',
    '--g-btn-primary-text': '#fff',
    '--g-btn-primary-bg': 'rgba(139,92,246,0.88)',
    '--g-btn-primary-border': 'rgba(139,92,246,0.88)',
    '--g-btn-primary-shadow': '0 1px 2px rgba(45,27,78,0.08)',
    '--g-btn-primary-inset-shadow': 'inset 0 0 0 1px rgba(255,255,255,0.25)',
    '--g-btn-primary-hover-bg': '#9d7cf7',
    '--g-btn-primary-hover-border': '#9d7cf7',
    '--g-btn-primary-selected-bg': 'rgba(139,92,246,0.92)',
    '--g-btn-primary-selected-shadow': 'inset 0 1px 2px rgba(45,27,78,0.10)',
    '--g-btn-primary-disabled-text': 'rgba(255,255,255,0.45)',
    '--g-btn-primary-disabled-bg': 'rgba(139,92,246,0.30)',
    '--g-btn-primary-disabled-border': 'rgba(139,92,246,0.20)',
    '--g-action-list-hover-bg': 'rgba(45,27,78,0.05)',
    '--g-segmented-bg': 'rgba(45,27,78,0.05)',
    '--g-segmented-btn-bg': '#f5f0ff',
    '--g-segmented-btn-border': 'rgba(45,27,78,0.12)',
    '--g-fg-default': '#2d1b4e',
    '--g-fg-muted': 'rgba(45,27,78,0.55)',
    '--g-fg-subtle': 'rgba(45,27,78,0.32)',
    '--g-canvas-default': 'rgba(245,240,255,0.82)',
    '--g-canvas-overlay': 'rgba(245,240,255,0.96)',
    '--g-canvas-inset': 'rgba(45,27,78,0.03)',
    '--g-canvas-subtle': 'rgba(45,27,78,0.03)',
    '--g-border-default': 'rgba(45,27,78,0.10)',
    '--g-border-muted': 'rgba(45,27,78,0.05)',
    '--g-neutral-muted': 'rgba(45,27,78,0.08)',
    '--g-accent-fg': '#8b5cf6',
    '--g-accent-emphasis': '#8b5cf6',
    '--g-accent-muted': 'rgba(139,92,246,0.22)',
    '--g-accent-subtle': 'rgba(139,92,246,0.07)',
    '--g-scale-gray-7': 'rgba(45,27,78,0.05)',
    '--g-scale-blue-8': 'rgba(139,92,246,0.10)',
    '--g-social-reaction-bg-hover': 'var(--g-scale-gray-7)',
    '--g-social-reaction-bg-reacted-hover': 'var(--g-scale-blue-8)',
    '--g-hover-shadow': '0 2px 8px rgba(45,27,78,0.08)',
    '--g-box-shadow': '0 1px 2px rgba(45,27,78,0.04)',
    '--g-textarea-bg': 'rgba(245,240,255,0.6)',
    '--g-textarea-border': 'rgba(45,27,78,0.10)',
    '--g-textarea-focus-border': 'rgba(139,92,246,0.5)',
    '--g-textarea-focus-shadow': '0 0 0 3px rgba(139,92,246,0.12)',
    '--g-comment-bg': 'rgba(245,240,255,0.55)',
    '--g-comment-border': 'rgba(45,27,78,0.05)',
    '--g-header-border': 'rgba(45,27,78,0.06)',
    '--g-primer-shadow-inset': 'inset 0 1px 0 rgba(45,27,78,0.04)',
  },
  // ========== cyan ==========
  'cyan-dark': {
    '--g-btn-text': 'rgba(207,250,254,0.92)',
    '--g-btn-bg': 'rgba(207,250,254,0.06)',
    '--g-btn-border': 'rgba(207,250,254,0.10)',
    '--g-btn-hover-bg': 'rgba(207,250,254,0.10)',
    '--g-btn-hover-border': 'rgba(207,250,254,0.16)',
    '--g-btn-active-bg': 'rgba(207,250,254,0.08)',
    '--g-btn-active-border': 'rgba(207,250,254,0.12)',
    '--g-btn-selected-bg': 'rgba(34,211,238,0.14)',
    '--g-btn-primary-text': '#fff',
    '--g-btn-primary-bg': 'rgba(34,211,238,0.88)',
    '--g-btn-primary-border': 'rgba(34,211,238,0.88)',
    '--g-btn-primary-shadow': '0 1px 2px rgba(0,0,0,0.12)',
    '--g-btn-primary-inset-shadow': 'inset 0 0 0 1px rgba(255,255,255,0.12)',
    '--g-btn-primary-hover-bg': '#5de0f5',
    '--g-btn-primary-hover-border': '#5de0f5',
    '--g-btn-primary-selected-bg': 'rgba(34,211,238,0.92)',
    '--g-btn-primary-selected-shadow': 'inset 0 1px 2px rgba(0,0,0,0.16)',
    '--g-btn-primary-disabled-text': 'rgba(255,255,255,0.32)',
    '--g-btn-primary-disabled-bg': 'rgba(34,211,238,0.22)',
    '--g-btn-primary-disabled-border': 'rgba(34,211,238,0.16)',
    '--g-action-list-hover-bg': 'rgba(207,250,254,0.04)',
    '--g-segmented-bg': 'rgba(207,250,254,0.04)',
    '--g-segmented-btn-bg': '#0a2a30',
    '--g-segmented-btn-border': 'rgba(207,250,254,0.10)',
    '--g-fg-default': 'rgba(207,250,254,0.92)',
    '--g-fg-muted': 'rgba(207,250,254,0.48)',
    '--g-fg-subtle': 'rgba(207,250,254,0.30)',
    '--g-canvas-default': 'rgba(10,42,48,0.72)',
    '--g-canvas-overlay': 'rgba(10,42,48,0.94)',
    '--g-canvas-inset': 'rgba(207,250,254,0.03)',
    '--g-canvas-subtle': 'rgba(207,250,254,0.03)',
    '--g-border-default': 'rgba(207,250,254,0.10)',
    '--g-border-muted': 'rgba(207,250,254,0.05)',
    '--g-neutral-muted': 'rgba(207,250,254,0.08)',
    '--g-accent-fg': '#22d3ee',
    '--g-accent-emphasis': '#22d3ee',
    '--g-accent-muted': 'rgba(34,211,238,0.28)',
    '--g-accent-subtle': 'rgba(34,211,238,0.09)',
    '--g-scale-gray-7': 'rgba(207,250,254,0.05)',
    '--g-scale-blue-8': 'rgba(34,211,238,0.16)',
    '--g-social-reaction-bg-hover': 'var(--g-scale-gray-7)',
    '--g-social-reaction-bg-reacted-hover': 'var(--g-scale-blue-8)',
    '--g-hover-shadow': '0 2px 8px rgba(0,0,0,0.22)',
    '--g-box-shadow': '0 1px 2px rgba(0,0,0,0.16)',
    '--g-textarea-bg': 'rgba(207,250,254,0.05)',
    '--g-textarea-border': 'rgba(207,250,254,0.10)',
    '--g-textarea-color': 'rgba(207,250,254,0.92)',
    '--g-textarea-focus-border': 'rgba(34,211,238,0.5)',
    '--g-textarea-focus-shadow': '0 0 0 3px rgba(34,211,238,0.12)',
    '--g-comment-bg': 'rgba(207,250,254,0.04)',
    '--g-comment-border': 'rgba(207,250,254,0.05)',
    '--g-header-border': 'rgba(207,250,254,0.06)',
  },
  'cyan-light': {
    '--g-btn-text': '#164e63',
    '--g-btn-bg': '#ecfeff',
    '--g-btn-border': 'rgba(22,78,99,0.12)',
    '--g-btn-shadow': '0 1px 2px rgba(22,78,99,0.05)',
    '--g-btn-inset-shadow': 'inset 0 0 0 1px rgba(255,255,255,0.5)',
    '--g-btn-hover-bg': '#e0f7fa',
    '--g-btn-hover-border': 'rgba(22,78,99,0.20)',
    '--g-btn-active-bg': '#cceef5',
    '--g-btn-active-border': 'rgba(22,78,99,0.22)',
    '--g-btn-selected-bg': 'rgba(6,182,212,0.10)',
    '--g-btn-primary-text': '#fff',
    '--g-btn-primary-bg': 'rgba(6,182,212,0.88)',
    '--g-btn-primary-border': 'rgba(6,182,212,0.88)',
    '--g-btn-primary-shadow': '0 1px 2px rgba(22,78,99,0.08)',
    '--g-btn-primary-inset-shadow': 'inset 0 0 0 1px rgba(255,255,255,0.25)',
    '--g-btn-primary-hover-bg': '#22d3ee',
    '--g-btn-primary-hover-border': '#22d3ee',
    '--g-btn-primary-selected-bg': 'rgba(6,182,212,0.92)',
    '--g-btn-primary-selected-shadow': 'inset 0 1px 2px rgba(22,78,99,0.10)',
    '--g-btn-primary-disabled-text': 'rgba(255,255,255,0.45)',
    '--g-btn-primary-disabled-bg': 'rgba(6,182,212,0.30)',
    '--g-btn-primary-disabled-border': 'rgba(6,182,212,0.20)',
    '--g-action-list-hover-bg': 'rgba(22,78,99,0.05)',
    '--g-segmented-bg': 'rgba(22,78,99,0.05)',
    '--g-segmented-btn-bg': '#ecfeff',
    '--g-segmented-btn-border': 'rgba(22,78,99,0.12)',
    '--g-fg-default': '#164e63',
    '--g-fg-muted': 'rgba(22,78,99,0.55)',
    '--g-fg-subtle': 'rgba(22,78,99,0.32)',
    '--g-canvas-default': 'rgba(236,254,255,0.82)',
    '--g-canvas-overlay': 'rgba(236,254,255,0.96)',
    '--g-canvas-inset': 'rgba(22,78,99,0.03)',
    '--g-canvas-subtle': 'rgba(22,78,99,0.03)',
    '--g-border-default': 'rgba(22,78,99,0.10)',
    '--g-border-muted': 'rgba(22,78,99,0.05)',
    '--g-neutral-muted': 'rgba(22,78,99,0.08)',
    '--g-accent-fg': '#06b6d4',
    '--g-accent-emphasis': '#06b6d4',
    '--g-accent-muted': 'rgba(6,182,212,0.22)',
    '--g-accent-subtle': 'rgba(6,182,212,0.07)',
    '--g-scale-gray-7': 'rgba(22,78,99,0.05)',
    '--g-scale-blue-8': 'rgba(6,182,212,0.10)',
    '--g-social-reaction-bg-hover': 'var(--g-scale-gray-7)',
    '--g-social-reaction-bg-reacted-hover': 'var(--g-scale-blue-8)',
    '--g-hover-shadow': '0 2px 8px rgba(22,78,99,0.08)',
    '--g-box-shadow': '0 1px 2px rgba(22,78,99,0.04)',
    '--g-textarea-bg': 'rgba(236,254,255,0.6)',
    '--g-textarea-border': 'rgba(22,78,99,0.10)',
    '--g-textarea-focus-border': 'rgba(6,182,212,0.5)',
    '--g-textarea-focus-shadow': '0 0 0 3px rgba(6,182,212,0.12)',
    '--g-comment-bg': 'rgba(236,254,255,0.55)',
    '--g-comment-border': 'rgba(22,78,99,0.05)',
    '--g-header-border': 'rgba(22,78,99,0.06)',
    '--g-primer-shadow-inset': 'inset 0 1px 0 rgba(22,78,99,0.04)',
  },
}

function getGiscusThemeUrl(): string {
  const themeStore = useThemeStore()
  const isDark = themeStore.isDark
  const style = themeStore.currentStyle
  const key = `${style}-${isDark ? 'dark' : 'light'}` as ThemeKey
  const vars = themeColors[key]

  // 生成 :root 变量块
  const rootBlock = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')

  const fullCss = `:root {\n${rootBlock}\n}\n\n${giscusBaseCss}`
  return `data:text/css;charset=utf-8,${encodeURIComponent(fullCss)}`
}

export const useCommentStore = defineStore('comment', () => {
  const commentLoaded = ref<boolean>(false)
  const commentEnabled = ref<boolean>(true)
  const commentPlatform = ref<'giscus' | 'disqus' | 'none'>('giscus')
  const commentCount = ref<number>(0)
  const isExpanded = ref<boolean>(false)

  const setCommentLoaded = (loaded: boolean): void => {
    commentLoaded.value = loaded
  }

  const toggleComments = (): void => {
    commentEnabled.value = !commentEnabled.value
    savePreference()
  }

  const setCommentCount = (count: number): void => {
    commentCount.value = count
  }

  const incrementCommentCount = (): void => {
    commentCount.value++
  }

  const toggleExpanded = (): void => {
    isExpanded.value = !isExpanded.value
  }

  const updateGiscusTheme = (_theme: string): void => {
    const themeUrl = getGiscusThemeUrl()
    const giscusFrame = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement | null
    if (giscusFrame?.contentWindow) {
      giscusFrame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: themeUrl } } },
        'https://giscus.app'
      )
    }
  }

  const initCommentSystem = (): void => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const existing = document.querySelector('.giscus, script[src*=\"giscus\"]')
    if (existing) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'Cnkrru/Blog')
    script.setAttribute('data-repo-id', '')
    script.setAttribute('data-category', 'General')
    script.setAttribute('data-category-id', '')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', getGiscusThemeUrl())
    script.setAttribute('data-lang', 'zh-CN')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    const container = document.querySelector('.comment-container')
    if (container) container.appendChild(script)
  }

  const savePreference = (): void => {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('comment_enabled', commentEnabled.value.toString())
    } catch (e) {
      console.warn('[commentStore] 保存评论偏好失败:', e)
    }
  }

  const loadPreference = (): void => {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('comment_enabled')
      if (saved !== null) {
        commentEnabled.value = saved === 'true'
      }
    } catch (e) {
      console.warn('[commentStore] 加载评论偏好失败:', e)
    }
  }

  return {
    commentLoaded,
    commentEnabled,
    commentPlatform,
    commentCount,
    isExpanded,
    setCommentLoaded,
    toggleComments,
    setCommentCount,
    incrementCommentCount,
    toggleExpanded,
    initCommentSystem,
    updateGiscusTheme,
    savePreference,
    loadPreference
  }
})
