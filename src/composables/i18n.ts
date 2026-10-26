import { ref } from 'vue'

/* ====================<locale>==================== */
// 当前语言只存字符串；文案表整表切换，模板里只做 {{}} 插值
export type Locale = 'zh' | 'en'

export const refLocale = ref<Locale>('zh')

// 中文文案表（作为类型基准，英文表必须与之同结构）
const zhText = {
  /* ----- 导航 ----- */
  navPost: '文章',
  navAbout: '关于',
  navArchive: '归档',
  navTag: '标签',
  navLink: '链接',
  navSetting: '设置',

  /* ----- 页头 ----- */
  menu: '菜单',
  pageLoading: '页面加载中',
  searchPlaceholder: '搜索',
  searchAria: '搜索文章',
  searchIndexing: '正在建立索引…',
  searchFailed: '索引加载失败，请刷新页面',
  searchNoResult: (keyword: string) => `搜索 "${keyword}"：未找到结果`,
  searchResults: (count: number) => `${count} 个结果`,
  searchCategory: '分类:',

  /* ----- 语言切换 ----- */
  language: '语言',
  localeZh: '中文',
  localeEn: 'English',

  /* ----- 首页 ----- */
  welcomeTexts: ['欢迎来到我的博客'],
  startReading: '开始阅读',
  aboutMe: '关于我',

  /* ----- 热力图 ----- */
  heatmapTitle: '创作活动热力图',
  months: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],
  yearLabel: (year: number) => `${year}年`,
  heatmapTip: (date: string, count: number) =>
    `${date}：${count > 0 ? `${count} 次活动` : '无活动'}`,
  heatmapNoData: '暂无数据',
  heatmapLess: '少',
  heatmapMore: '多',

  /* ----- 音乐 ----- */
  musicCoverAlt: '封面',
  musicNoSong: '未选择歌曲',
  musicUnknownArtist: '未知艺术家',
  musicLoading: '加载中…',
  musicLoadFailed: '音乐源加载失败',
  musicClose: '关闭',
  musicPrev: '上一首',
  musicPlayPause: '播放/暂停',
  musicNext: '下一首',
  musicMute: '静音',
  musicPlaylist: (count: number) => `播放列表 (${count})`,

  /* ----- 侧栏 ----- */
  avatarAlt: 'Cnkrru的头像',
  avatarTitle: '头像',
  sidebarWelcome: '欢迎来到我的博客',
  stats: '统计',
  siteStats: '站点统计',
  todayPv: '今日访问',
  todayUv: '今日访客',
  sitePv: '站点访问',
  siteUv: '站点访客',
  pagePv: '本页浏览',
  pageUv: '本页访客',
  unknown: '未知',

  /* ----- 文章 ----- */
  postPublished: '发布',
  postUpdated: '更新于',
  postHistory: '更新记录',
  prevPost: '上一篇',
  nextPost: '下一篇',
  noPost: '暂无',
  wordCount: '总字数',
  readingTimeLabel: '预计时间',
  readingMinutes: (minutes: number) => `${minutes}分钟`,
  toc: '目录',
  tocOpen: '打开目录',
  tocTitle: '文章目录',
  tocClose: '关闭目录',
  shareThis: '分享这篇文章',
  sponsor: '赞助',
  wechatQr: '微信分享二维码',
  wechatAria: '微信',
  weiboAria: '微博',
  commentTitle: '评论',
  commentPlaceholder: '想说点什么呢……',
  commentFailed: '评论加载失败，请刷新页面',
  postNotFound: '没有找到这篇文章，',
  backHome: '返回首页',

  /* ----- 分页 ----- */
  prevPage: '上一页',
  nextPage: '下一页',
  totalPages: (total: number) => `共 ${total} 页`,

  /* ----- 分类归档 ----- */
  categoryTab: '分类',
  yearTab: '年份',
  monthTab: '月份',
  postsCount: (count: number) => `${count} 篇`,
  noPosts: '暂无文章',

  /* ----- 标签 ----- */
  tagPosts: (name: string) => `「${name}」下的文章`,

  /* ----- 友情链接 ----- */
  linkCategoryBtn: '分类 ▾',
  linkPageInfo: (page: number, total: number, category: string) =>
    `第 ${page} / ${total} 页 · 当前分类：${category}`,

  /* ----- 设置 ----- */
  themeStyle: '主题风格',
  themeBlue: '天蓝色',
  themeInk: '水墨风',
  themeSakura: '樱花粉',
  themePurple: '紫罗兰',
  themeCyan: '天青色',
  layoutStyle: '布局风格',
  layoutDefault: '默认',
  layoutCard: '卡片式',
  opacityAdjust: '透明度调节',
  background: '背景',
  bgVideo: '视频',
  bgImage: '图片',

  /* ----- 404 ----- */
  notFoundTitle: '页面不存在',
  notFoundText: '你访问的页面可能已被移除或地址有误。',

  /* ----- 关于页 ----- */
  aboutTitle: '关于我',
  aboutIntro: '个人简介',
  aboutIntro1: '就读于东北电力大学,专业为电气工程及其自动化.',
  aboutIntro2: '对编程感兴趣,自学了点编程.',
  aboutStack: '技术栈',
  aboutFrontend: '前端',
  aboutBackend: '后端',
  aboutHardware: '硬件',
  aboutTools: '工具',
  aboutContact: '联系方式',
  aboutEmail: '邮箱',

  /* ----- 页脚 ----- */
  runtime: (days: number, hours: number, minutes: number, seconds: number) =>
    `本博客已运行: ${days} 天 ${hours} 时 ${minutes} 分 ${seconds}秒`,

  /* ----- 通用提示 ----- */
  copied: (text: string) => `已成功复制${text}`,
  closeTip: '关闭提示',
  codeCollapse: '收起',
  codeExpand: (lines: string) => `展开（共 ${lines} 行）`,
  codeExpandAria: (lines: string) => `展开代码（共 ${lines} 行）`,
}

export type I18nText = typeof zhText

const enText: I18nText = {
  navPost: 'Posts',
  navAbout: 'About',
  navArchive: 'Archive',
  navTag: 'Tags',
  navLink: 'Links',
  navSetting: 'Settings',

  menu: 'Menu',
  pageLoading: 'Page loading',
  searchPlaceholder: 'Search',
  searchAria: 'Search posts',
  searchIndexing: 'Building index…',
  searchFailed: 'Failed to load index. Please refresh the page',
  searchNoResult: (keyword: string) => `Search "${keyword}": no results`,
  searchResults: (count: number) => `${count} results`,
  searchCategory: 'Category:',

  language: 'Language',
  localeZh: '中文',
  localeEn: 'English',

  welcomeTexts: ['welcome to my blog'],
  startReading: 'Start reading',
  aboutMe: 'About me',

  heatmapTitle: 'Activity heatmap',
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  yearLabel: (year: number) => `${year}`,
  heatmapTip: (date: string, count: number) =>
    `${date}: ${count > 0 ? `${count} activities` : 'No activity'}`,
  heatmapNoData: 'No data',
  heatmapLess: 'Less',
  heatmapMore: 'More',

  musicCoverAlt: 'Cover',
  musicNoSong: 'No song selected',
  musicUnknownArtist: 'Unknown artist',
  musicLoading: 'Loading…',
  musicLoadFailed: 'Failed to load music source',
  musicClose: 'Close',
  musicPrev: 'Previous',
  musicPlayPause: 'Play/Pause',
  musicNext: 'Next',
  musicMute: 'Mute',
  musicPlaylist: (count: number) => `Playlist (${count})`,

  avatarAlt: "Cnkrru's avatar",
  avatarTitle: 'Avatar',
  sidebarWelcome: 'Welcome to my blog',
  stats: 'Stats',
  siteStats: 'Site stats',
  todayPv: 'Today views',
  todayUv: 'Today visitors',
  sitePv: 'Total views',
  siteUv: 'Total visitors',
  pagePv: 'Page views',
  pageUv: 'Page visitors',
  unknown: 'Unknown',

  postPublished: 'Published',
  postUpdated: 'Updated',
  postHistory: 'Changelog',
  prevPost: 'Previous',
  nextPost: 'Next',
  noPost: 'N/A',
  wordCount: 'Words',
  readingTimeLabel: 'Reading time',
  readingMinutes: (minutes: number) => `${minutes} min`,
  toc: 'Contents',
  tocOpen: 'Open contents',
  tocTitle: 'Table of contents',
  tocClose: 'Close contents',
  shareThis: 'Share this post',
  sponsor: 'Sponsor',
  wechatQr: 'WeChat share QR code',
  wechatAria: 'WeChat',
  weiboAria: 'Weibo',
  commentTitle: 'Comments',
  commentPlaceholder: 'Say something…',
  commentFailed: 'Failed to load comments. Please refresh the page',
  postNotFound: 'Post not found. ',
  backHome: 'Back to home',

  prevPage: 'Previous',
  nextPage: 'Next',
  totalPages: (total: number) => `${total} pages`,

  categoryTab: 'Category',
  yearTab: 'Year',
  monthTab: 'Month',
  postsCount: (count: number) => `${count} posts`,
  noPosts: 'No posts',

  tagPosts: (name: string) => `Posts tagged "${name}"`,

  linkCategoryBtn: 'Category ▾',
  linkPageInfo: (page: number, total: number, category: string) =>
    `Page ${page} / ${total} · Category: ${category}`,

  themeStyle: 'Theme',
  themeBlue: 'Sky blue',
  themeInk: 'Ink',
  themeSakura: 'Sakura',
  themePurple: 'Violet',
  themeCyan: 'Cyan',
  layoutStyle: 'Layout',
  layoutDefault: 'Default',
  layoutCard: 'Card',
  opacityAdjust: 'Opacity',
  background: 'Background',
  bgVideo: 'Video',
  bgImage: 'Image',

  notFoundTitle: 'Page not found',
  notFoundText: 'The page may have been removed or the address is incorrect.',

  aboutTitle: 'About me',
  aboutIntro: 'Profile',
  aboutIntro1:
    'Studying Electrical Engineering and Automation at Northeast Electric Power University.',
  aboutIntro2: 'Interested in programming, learned some on my own.',
  aboutStack: 'Tech stack',
  aboutFrontend: 'Frontend',
  aboutBackend: 'Backend',
  aboutHardware: 'Hardware',
  aboutTools: 'Tools',
  aboutContact: 'Contact',
  aboutEmail: 'Email',

  runtime: (days: number, hours: number, minutes: number, seconds: number) =>
    `Blog running: ${days}d ${hours}h ${minutes}m ${seconds}s`,

  copied: (text: string) => `Copied ${text}`,
  closeTip: 'Close notification',
  codeCollapse: 'Collapse',
  codeExpand: (lines: string) => `Expand (${lines} lines)`,
  codeExpandAria: (lines: string) => `Expand code (${lines} lines)`,
}

// 当前文案表：切换语言时整表替换，模板保持纯插值
export const refText = ref<I18nText>(zhText)

const localeTag: Record<Locale, string> = { zh: 'zh-CN', en: 'en-US' }

export const switchLocale = (locale: Locale) => {
  refLocale.value = locale
  // if-else 选表，不引入新的模板语法
  if (locale === 'en') {
    refText.value = enText
  } else {
    refText.value = zhText
  }
  document.documentElement.lang = localeTag[locale]
  localStorage.setItem('locale', locale)
  console.info(`[INFO]:语言切换成功,当前语言为${locale}`)
}

export const initLocale = () => {
  const store = localStorage.getItem('locale')
  const locale: Locale = store === 'en' ? 'en' : 'zh'
  switchLocale(locale)
  console.info('[INFO]:语言初始化成功')
}
