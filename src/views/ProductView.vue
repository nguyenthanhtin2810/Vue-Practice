<template>
  <Header v-model="searchTerm" />
  <div class="max-w-7xl mx-auto p-4 mt-10">
    <h1>{{ debouncedSearchTerm }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Header from '../components/Header.vue';
import useDebounce from '../utils/useDebounce';

export default defineComponent({
  name: 'ProductView',
  components: {
    Header,
  },
  setup() {
    const searchTerm = ref('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    return {
      searchTerm,
      debouncedSearchTerm,
    };
  },
});
</script>
