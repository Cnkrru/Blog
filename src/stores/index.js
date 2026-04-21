import { createPinia } from 'pinia'
import { useArticlesStore } from './articles'
import { useLive2dStore } from './live2d'
import { useThemeStore } from './theme'
import { useMusicStore } from './music'
import { useGlobalStore } from './global'
import { useUserStore } from './user'
import { useAnnouncementStore } from './announcement'
import { useAudioStore } from './audio'
import { useScrollStore } from './scroll'
import { useClipboardStore } from './clipboard'
import { useCodeStore } from './code'
import { useCommentStore } from './comment'
import { useContentStore } from './content'
import { useDynamicEffectsStore } from './dynamicEffects'
import { useMathStore } from './math'
import { useMermaidStore } from './mermaid'
import { useMouseStore } from './mouse'
import { useNotificationStore } from './notification'
import { usePostsStore } from './posts'
import { useTagStore } from './tag'
import { useTocStore } from './toc'

const pinia = createPinia()

export {
  pinia,
  useArticlesStore,
  useLive2dStore,
  useThemeStore,
  useMusicStore,
  useGlobalStore,
  useUserStore,
  useAnnouncementStore,
  useAudioStore,
  useScrollStore,
  useClipboardStore,
  useCodeStore,
  useCommentStore,
  useContentStore,
  useDynamicEffectsStore,
  useMathStore,
  useMermaidStore,
  useMouseStore,
  useNotificationStore,
  usePostsStore,
  useTagStore,
  useTocStore
}