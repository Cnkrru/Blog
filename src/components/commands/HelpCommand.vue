<script setup>
const helpCommand = {
  name: 'help',
  description: '显示帮助信息',
  execute(terminal) {
    terminal.addLine('可用命令：');
    terminal.addLine('- help: 显示帮助信息');
    terminal.addLine('- clear: 清空终端');
    terminal.addLine('- exit: 退出终端');
    terminal.addLine('- ls: 展示除了终端和日志的其他网页');
    terminal.addLine('- cd [网页名]: 进入对应页面');
  }
};

defineExpose({
  helpCommand
});
</script>