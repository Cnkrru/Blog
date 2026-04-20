const infoData = {
  name: 'Cnkrru Blog',
  description: '一个分享技术与生活的个人博客',
  author: 'Cnkrru',
  email: '3253884026@qq.com',
  github: 'https://github.com/Cnkrru',
  domain: 'https://cnkrru.top',
  builtWith: ['Vue 3', 'Vite', 'Markdown', 'Web Serial API'],
  features: ['文章分享', '项目展示', '工具集', '串口调试'],
  articleCount: 8,
  projectCount: 2,
  toolCount: 1
};

export const infoCommand = {
  name: 'info',
  description: '显示网站信息',
  execute(terminal) {
    terminal.addLine('');
    terminal.addLine('╔═══════════════════════════════════════════════════════════╗');
    terminal.addLine('║                    网站信息                                  ║');
    terminal.addLine('╠═══════════════════════════════════════════════════════════╣');
    terminal.addLine(`║ 网站名称:    ${infoData.name.padEnd(39)}║`);
    terminal.addLine(`║ 作者:        ${infoData.author.padEnd(39)}║`);
    terminal.addLine(`║ 邮箱:        ${infoData.email.padEnd(39)}║`);
    terminal.addLine(`║ GitHub:      ${infoData.github.padEnd(39)}║`);
    terminal.addLine(`║ 域名:        ${infoData.domain.padEnd(39)}║`);
    terminal.addLine('╠═══════════════════════════════════════════════════════════╣');
    terminal.addLine(`║ 描述:        ${infoData.description.padEnd(39)}║`);
    terminal.addLine('╠═══════════════════════════════════════════════════════════╣');
    terminal.addLine('║ 技术栈:                                                      ║');
    infoData.builtWith.forEach(tech => {
      terminal.addLine(`║   • ${tech.padEnd(51)}║`);
    });
    terminal.addLine('╠═══════════════════════════════════════════════════════════╣');
    terminal.addLine('║ 功能:                                                        ║');
    infoData.features.forEach(feature => {
      terminal.addLine(`║   • ${feature.padEnd(51)}║`);
    });
    terminal.addLine('╠═══════════════════════════════════════════════════════════╣');
    terminal.addLine(`║ 文章数量:    ${infoData.articleCount}                                         ║`);
    terminal.addLine(`║ 项目数量:    ${infoData.projectCount}                                          ║`);
    terminal.addLine(`║ 工具数量:    ${infoData.toolCount}                                          ║`);
    terminal.addLine('╚═══════════════════════════════════════════════════════════╝');
    terminal.addLine('');
  }
};
