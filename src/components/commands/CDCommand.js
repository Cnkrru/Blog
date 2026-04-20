const pages = {
  // 主页面
  'home': { name: '首页', path: '/home' },
  'archives': { name: '归档', path: '/archives' },
  'search': { name: '搜索', path: '/search' },
  'tags': { name: '标签', path: '/tags' },
  'categories': { name: '分类', path: '/categories' },
  'links': { name: '链接', path: '/links' },
  'tools': { name: '工具', path: '/tools' },
  // 文章子页面
  'post/0': { name: '文章1', path: '/post/0' },
  'post/1': { name: '文章2', path: '/post/1' },
  'post/2': { name: '文章3', path: '/post/2' },
  'post/3': { name: '文章4', path: '/post/3' },
  'post/4': { name: '文章5', path: '/post/4' },
  'post/5': { name: '文章6', path: '/post/5' },
  'post/6': { name: '文章7', path: '/post/6' },
  'post/7': { name: '文章8', path: '/post/7' },
  // 项目子页面
  'project/0': { name: '项目1', path: '/project/0' },
  'project/1': { name: '项目2', path: '/project/1' },
  // 工具子页面
  'tool/1': { name: '串口工具', path: '/tool/1' }
};

export const cdCommand = {
  name: 'cd',
  description: '进入对应页面',
  execute(terminal, args) {
    const page = args[0];
    if (!page) {
      terminal.addLine('错误: 请指定要进入的页面', 'error');
      terminal.addLine('用法: cd [页面名]');
      terminal.addLine('例如: cd home, cd post/0, cd tool/1');
      return;
    }

    if (pages[page]) {
      terminal.addLine(`进入 ${pages[page].name}...`);
      setTimeout(() => {
        window.location.href = pages[page].path;
      }, 1000);
    } else {
      terminal.addLine(`错误: 页面 "${page}" 不存在`, 'error');
      terminal.addLine('使用 ls 命令查看可用页面');
    }
  }
};
