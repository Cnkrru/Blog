<script setup>
const lsCommand = {
  name: 'ls',
  description: '展示除了终端和日志的其他网页',
  execute(terminal) {
    terminal.addLine('网站页面结构：');
    terminal.addLine('├── home/           # 首页');
    terminal.addLine('├── archives/       # 归档');
    terminal.addLine('├── search/         # 搜索');
    terminal.addLine('├── tags/           # 标签');
    terminal.addLine('├── categories/     # 分类');
    terminal.addLine('├── links/          # 链接');
    terminal.addLine('└── tools/          # 工具');
  }
};

defineExpose({
  lsCommand
});
</script>