import axios from 'axios'
import { AVATOR_SRC } from '@/composables/common/config'

/* ====================<sidebar>==================== */
// 侧边栏是否展开：true 展开，false 收起
export let isSidebar = false

/*
 * fn:侧边栏显隐
 * des:切换 isSidebar 并同步 .sidebar-open 类，抽屉位移与遮罩显隐交给 CSS
 * type:private
 * param:无
 * return：无
 */
const sidebar = () => {
  const sidebarEl = document.querySelector<HTMLElement>('.sidebar')!
  isSidebar = !isSidebar
  if (isSidebar) sidebarEl.classList.add('sidebar-open')
  if (!isSidebar) sidebarEl.classList.remove('sidebar-open')
}

/*
 * fn:绑定侧边栏开关
 * des:onMounted 之后给 header 的汉堡键和移动端遮罩绑定点击事件，点击一次切换一次
 * type:public
 * param:无
 * return：无
 */
export const setSidebar = () => {
  document.querySelector('#sidebar-btn')?.addEventListener('click', sidebar)
  document.querySelector('.sidebar-overlay')?.addEventListener('click', sidebar)
}

/* ====================<avator>==================== */
/*
 * fn:设置头像
 * des:把配置中的头像地址写入 #avatorImg 的 src
 * type:public
 * param:无
 * return：无
 */
export const setAvator = () => {
  const avator = document.querySelector<HTMLImageElement>('#avatorImg')
  if (avator) {
    avator.src = AVATOR_SRC
  }
}

/* ====================<weather>==================== */
/*
 * fn:获取天气
 * des:先用 ipinfo.io 按访问者 IP 取得经纬度，再向 open-meteo 请求当前温度，写入侧边栏并移除骨架屏
 * type:public
 * param:无
 * return：无
 */
export const weather = async () => {
  let _weatherLoading = true
  const ipEl = document.querySelector('#ip')!
  const weatherEl = document.querySelector('#weather')!

  const ipData = (await axios.get('https://ipinfo.io/json')).data
  if (!ipData?.loc) return
  const lat = ipData.loc.split(',')[0]!
  const lon = ipData.loc.split(',')[1]!

  const { data } = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`,
  )
  _weatherLoading = false
  ipEl.classList.remove('weather-skeleton', 'weather-skeleton-city')
  weatherEl.classList.remove('weather-skeleton', 'weather-skeleton-temp')
  ipEl.textContent = ipData.city
  weatherEl.textContent = data.current.temperature_2m
  console.info('[INFO]:天气数据获取成功')
}

/* ====================<nav>==================== */
// 侧边栏导航数据，供 Nav.vue 用 v-for 渲染；elName 为显示名，elTo 为路由地址
export const nav = [
  { elName: '文章', elTo: '/postlist' },
  { elName: '关于', elTo: '/about' },
  { elName: '分类', elTo: '/category' },
  { elName: '标签', elTo: '/tag' },
  { elName: '图集', elTo: '/photo' },
  { elName: '链接', elTo: '/link' },
  { elName: '设置', elTo: '/setting' },
]
/* ====================<busuanzi>==================== */
// 不蒜子选择器列表
export const busuanziList = [
  { item: '今日访问', id: 'busuanzi_today_pv' },
  { item: '今日访客', id: 'busuanzi_today_uv' },
  { item: '站点访问', id: 'busuanzi_site_pv' },
  { item: '站点访客', id: 'busuanzi_site_uv' },
  { item: '本页浏览', id: 'busuanzi_page_pv' },
  { item: '本页访客', id: 'busuanzi_page_uv' },
]
/*
 * fn:创建不蒜子script
 * des:向 body 注入不蒜子统计脚本；已存在则直接返回，避免重复加载
 * type:public
 * param:无
 * return：无
 */
export const buSuanZi = () => {
  if (document.querySelector('.bsz-script')) return
  const s = document.createElement('script')
  s.className = 'bsz-script'
  s.async = true
  s.defer = true
  s.src = 'https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js'
  document.body.appendChild(s)
}

/*
 * fn:打开不蒜子弹窗
 * des:取页面上的 .bsz-box 弹窗并调用 showModal 以模态方式打开
 * type:public
 * param:无
 * return：无
 */
export const bszOpen = () => {
  const bszOpenBtn = document.querySelector('#bszOpen')!
  bszOpenBtn.addEventListener('click', () => {
    document.querySelector<HTMLDialogElement>('.bsz-box')!.showModal()
  })
}

/*
 * fn:关闭不蒜子弹窗
 * des:取页面上的 .bsz-box 弹窗并调用 close 关闭
 * type:public
 * param:无
 * return：无
 */
export const bszClose = () => {
  const bszCloseBtn = document.querySelector('#bszClose')!
  bszCloseBtn.addEventListener('click', () => {
    document.querySelector<HTMLDialogElement>('.bsz-box')!.close()
  })
}
