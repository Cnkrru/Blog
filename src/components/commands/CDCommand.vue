<script setup>
const pages = {
  'home': '首页',
  'archives': '归档',
  'search': '搜索',
  'tags': '标签',
  'categories': '分类',
  'links': '链接',
  'tools': '工具'
};

const cdCommand = {
  name: 'cd',
  description: '进入对应页面',
  execute(terminal, args) {
    const page = args[0];
    if (!page) {
      terminal.addLine('错误: 请指定要进入的页面', 'error');
      return;
    }
    
    if (pages[page]) {
      terminal.addLine(`进入 ${pages[page]}...`);
      setTimeout(() => {
        window.location.href = `/${page}`;
      }, 1000);
    } else {
      terminal.addLine(`错误: 页面 "${page}" 不存在`, 'error');
    }
  }
};

defineExpose({
  cdCommand
});
</script>