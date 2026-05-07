import { createPinia } from 'pinia'

export { useThemeStore } from './theme'
export { useScrollStore } from './scroll'
export { useTagStore } from './tag'
export { useTocStore, type TocItem } from './toc'
export { useNotificationStore, type NotificationItem } from './notification'
export { useMouseStore } from './mouse'
export { useAudioStore } from './audio'
export { useLive2dStore } from './live2d'
export { useDynamicEffectsStore } from './dynamicEffects'
export { useMathStore } from './math'
export { useMermaidStore } from './mermaid'
export { useCodeStore, type CopyHistoryItem } from './code'
export { useClipboardStore, type CopyHistoryItem as ClipboardItem } from './clipboard'
export { useUserStore } from './user'
export { useCommentStore } from './comment'
export { useGlobalStore, type SiteConfig } from './global'
export { useContentStore } from './content'
export { usePostsStore } from './posts'
export { useArticlesStore } from './articles'
export { useMusicStore, type Track } from './music'
export { useAnnouncementStore } from './announcement'

const pinia = createPinia()

export { pinia }
