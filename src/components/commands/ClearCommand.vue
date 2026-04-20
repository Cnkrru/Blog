<script setup>
const clearCommand = {
  name: 'clear',
  description: '清空终端',
  execute(terminal) {
    terminal.output.innerHTML = '';
  }
};

defineExpose({
  clearCommand
});
</script>