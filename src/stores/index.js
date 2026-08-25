import { createPinia } from 'pinia'

export { useThemeStore } from './theme'
export { useScrollStore } from './scroll'
export { useTagStore } from './tag'
export { useTocStore } from './toc'
export { useNotificationStore } from './notification'
export { useMouseStore } from './mouse'
export { useAudioStore } from './audio'
export { useDynamicEffectsStore } from './dynamicEffects'
export { useMathStore } from './math'
export { useMermaidStore } from './mermaid'
export { useCodeStore } from './code'
export { useClipboardStore } from './clipboard'
export { useCommentStore } from './comment'
export { useGlobalStore } from './global'
export { useContentStore } from './content'
export { useArticlesStore } from './articles'
export { useMusicStore } from './music'
export { useAnnouncementStore } from './announcement'

const pinia = createPinia()

export { pinia }