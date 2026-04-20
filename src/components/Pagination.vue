<script setup>
defineProps({
  currentPage: { type: Number, required: true },
  totalPages:  { type: Number, required: true },
  prevLabel:   { type: String, default: '上一页' },
  nextLabel:   { type: String, default: '下一页' },
})

const emit = defineEmits(['change'])
</script>

<template>
  <div class="pagination-container" v-if="totalPages > 1">
    <ul class="pagination">
      <li :class="{ disabled: currentPage === 1 }">
        <a href="#" @click.prevent="emit('change', currentPage - 1)">{{ prevLabel }}</a>
      </li>
      <li
        v-for="page in totalPages"
        :key="page"
        :class="{ active: currentPage === page }"
      >
        <a href="#" @click.prevent="emit('change', page)">{{ page }}</a>
      </li>
      <li :class="{ disabled: currentPage === totalPages }">
        <a href="#" @click.prevent="emit('change', currentPage + 1)">{{ nextLabel }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.pagination-container {
  margin: 30px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.pagination li { margin: 0 5px; }

.pagination a {
  display: inline-block;
  padding: 8px 12px;
  text-decoration: none;
  color: var(--text-color);
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.pagination a:hover { background-color: var(--hover-bg); }

.pagination .active a {
  background-color: var(--button-bg);
  color: var(--button-text);
  border-color: var(--button-bg);
}

.pagination .disabled a {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination .disabled a:hover { background-color: var(--card-bg); }

@media (max-width: 768px) {
  .pagination a { padding: 6px 10px; font-size: 14px; }
  .pagination li { margin: 0 3px; }
}
</style>
