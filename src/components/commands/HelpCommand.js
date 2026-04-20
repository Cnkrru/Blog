export const helpCommand = {
  name: 'help',
  description: '显示帮助信息',
  execute(terminal) {
    terminal.addLine('可用命令：');
    terminal.addLine('');
    terminal.addLine('系统命令：');
    terminal.addLine('  help              显示帮助信息');
    terminal.addLine('  info              显示网站信息');
    terminal.addLine('  clear             清空终端');
    terminal.addLine('  exit              退出终端');
    terminal.addLine('');
    terminal.addLine('导航命令：');
    terminal.addLine('  ls [路径]         列出目录内容');
    terminal.addLine('  cd [页面名]       进入对应页面');
    terminal.addLine('');
    terminal.addLine('页面名示例：');
    terminal.addLine('  home, archives, search, tags, links, tools');
    terminal.addLine('  post/0 ~ post/7, project/0, project/1, tool/1');
  }
};
