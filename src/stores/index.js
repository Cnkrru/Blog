import { createPinia } from 'pinia'

export { useThemeStore } from './theme'
export { useScrollStore } from './scroll'
export { useTocStore } from './toc'
export { useNotificationStore } from './notification'
export { useMouseStore } from './mouse'
export { useAudioStore } from './audio'
export { useCodeStore } from './code'
export { useContentStore } from './content'
export { useArticlesStore } from './articles'
export { useMusicStore } from './music'
export { useImmersiveStore } from './immersive'

const pinia = createPinia()

export { pinia }