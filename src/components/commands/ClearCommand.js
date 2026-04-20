export const clearCommand = {
  name: 'clear',
  description: '清空终端',
  execute(terminal) {
    terminal.output.innerHTML = '';
  }
};
