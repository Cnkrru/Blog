export interface Article {
  id: string
  title: string
  date: string
  tags: string[]
  category?: string
  description?: string
  cover?: string
  [key: string]: any
}

export interface TocItem {
  id: string
  text: string
  level: number
  children?: TocItem[]
}

export interface AppNotification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration: number
  buttons: Array<{ text: string; onClick: () => void }>
}

export interface Track {
  id: string
  title: string
  artist: string
  album?: string
  url: string
  cover?: string
  duration?: number
  lyrics?: string
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}
