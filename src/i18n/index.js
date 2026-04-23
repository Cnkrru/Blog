import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    hello: 'Hello',
    welcome: 'Welcome to my blog',
    about: 'About',
    archives: 'Archives',
    links: 'Links',
    tools: 'Tools',
    projects: 'Projects',
    home: 'Home',
    search: 'Search',
    categories: 'Categories',
    tags: 'Tags',
    noResults: 'No results found',
    resultsFound: 'results found',
    recentPosts: 'Recent Posts',
    readMore: 'Read More',
    comments: 'Comments',
    share: 'Share',
    qrcode: 'QR Code',
    readingTime: 'Reading Time',
    previous: 'Previous',
    next: 'Next',
    websiteAge: 'Website established for ',
    articleCount: '{count} articles in total',
    year: 'year',
    month: 'month',
    day: 'day',
    hour: 'hour',
    minute: 'minute',
    second: 'second',
    notFound: {
      title: '404 Not Found',
      message: 'The page you are looking for does not exist. Please check the URL.',
      backHome: 'Back to Home'
    }
  },
  zh: {
    hello: '你好',
    welcome: '欢迎来到我的博客',
    about: '关于',
    archives: '归档',
    links: '友链',
    tools: '工具',
    projects: '项目',
    home: '首页',
    search: '搜索',
    categories: '分类',
    tags: '标签',
    noResults: '未找到结果',
    resultsFound: '个结果',
    recentPosts: '最新文章',
    readMore: '阅读更多',
    comments: '评论',
    share: '分享',
    qrcode: '二维码',
    readingTime: '阅读时间',
    previous: '上一篇',
    next: '下一篇',
    websiteAge: '本站已建立',
    articleCount: '共 {count} 篇文章',
    year: '年',
    month: '月',
    day: '天',
    hour: '时',
    minute: '分',
    second: '秒',
    notFound: {
      title: '404 页面不存在',
      message: '您访问的页面不存在，请检查URL是否正确',
      backHome: '返回首页'
    }
  }
}

const i18n = createI18n({
  locale: 'zh',
  messages,
  legacy: false
})

export default i18n