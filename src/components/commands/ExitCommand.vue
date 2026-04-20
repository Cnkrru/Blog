<script setup>
const exitCommand = {
  name: 'exit',
  description: '退出终端',
  execute(terminal) {
    terminal.addLine('退出终端...');
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }
};

defineExpose({
  exitCommand
});
</script>