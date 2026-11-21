/* ====================<backToTop>==================== */
export const backToTop = () => {
  const area = document.querySelector('.main')
  const canArea = area && area.scrollHeight > area.clientHeight
  if (canArea) {
    area.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

export const scrollProgress = (): (() => void) => {
  const area = document.querySelector<HTMLElement>('.main')
  // 收窄到返回顶部按钮内部。正文的 progress 围栏代码块也生成 .progress（在 .main 内、文档序更靠前），
  //   用全局 '.progress' 会命中正文那个 div，进度环 span 反而取不到、--scroll-deg 永远没值
  const progress = document.querySelector<HTMLElement>('.back-top-btn .progress')
  if (!area || !progress) return () => {}

  const update = () => {
    // canArea 改为每次重算。原先只在挂载时探一次，而正文是异步组件（客户端跳转时挂载瞬间
    //   .main 还没被撑开），会被误判成"不可滚"从而只监听 window；此后桌面端真正滚动的是 .main，
    //   收不到 window 的 scroll 事件，进度就永久冻结（移动端恰好 window 才是滚动者，所以没暴露）
    const canArea = area.scrollHeight > area.clientHeight
    // 进度改以正文块(.content)为基准。桌面端 .main 可滚时仍按容器行程计；
    //   移动端整页滚动时不再回落 window(body) 整页行程，改按正文块顶部进视口→底部出视口计
    let _progress = 0
    if (canArea) {
      const total = area.scrollHeight - area.clientHeight // 用总可滚px做保护
      _progress = total > 0 ? Math.min(1, area.scrollTop / total) : 0
    } else {
      const content = document.querySelector<HTMLElement>('.content')
      if (content) {
        const rect = content.getBoundingClientRect()
        const total = rect.height - window.innerHeight // 正文块高 − 可视高 = 有效阅读行程
        _progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
      }
    }
    // --progress 一符多义，这里角度值改用 --scroll-deg 专用
    progress.style.setProperty('--scroll-deg', _progress * 360 + 'deg') // 设置样式
  }

  // 同时监听 .main 与 window——滚动者取决于当前布局（桌面滚 .main、移动端滚 window），
  //   两边都挂才能在异步内容撑开 .main 后自动切换到正确的度量口径
  area.addEventListener('scroll', update, { passive: true })
  window.addEventListener('scroll', update, { passive: true })
  update()
  // 返回清理函数，供 BackToTop 卸载时解绑（原先每次挂载都新增监听，反复切页累积）
  return () => {
    area.removeEventListener('scroll', update)
    window.removeEventListener('scroll', update)
  }
}
