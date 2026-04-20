export const lsCommand = {
  name: 'ls',
  description: '展示除了终端和日志的其他网页',
  execute(terminal) {
    terminal.addLine('网站页面结构：');
    terminal.addLine('');
    terminal.addLine('主页面：');
    terminal.addLine('├── home/           # 首页');
    terminal.addLine('├── archives/       # 归档');
    terminal.addLine('├── search/         # 搜索');
    terminal.addLine('├── tags/           # 标签');
    terminal.addLine('├── categories/     # 分类');
    terminal.addLine('├── links/          # 链接');
    terminal.addLine('└── tools/          # 工具');
    terminal.addLine('');
    terminal.addLine('工具子页面：');
    terminal.addLine('└── tools/');
    terminal.addLine('    └── tool/1       # 串口工具');
    terminal.addLine('');
    terminal.addLine('文章子页面：');
    terminal.addLine('└── post/');
    terminal.addLine('    ├── post/0       # 文章1');
    terminal.addLine('    ├── post/1       # 文章2');
    terminal.addLine('    ├── post/2       # 文章3');
    terminal.addLine('    ├── post/3       # 文章4');
    terminal.addLine('    ├── post/4       # 文章5');
    terminal.addLine('    ├── post/5       # 文章6');
    terminal.addLine('    ├── post/6       # 文章7');
    terminal.addLine('    └── post/7       # 文章8');
    terminal.addLine('');
    terminal.addLine('项目子页面：');
    terminal.addLine('└── project/');
    terminal.addLine('    ├── project/0    # 项目1');
    terminal.addLine('    └── project/1    # 项目2');
  }
};
