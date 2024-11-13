<template>
  <Header v-model="searchTerm" />
  <div class="max-w-7xl mx-auto p-4 mt-10">
    <ProductList
      :products="products"
      :searchTerm="debouncedSearchTerm"
      v-model="searchTerm"
      :resetFilters="resetFilters"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import Header from '../components/Header.vue';
import ProductList from '../components/ProductList.vue';
import { Product } from '../types/products.types';
import { fetchData } from '../services/api';
import useDebounce from '../utils/useDebounce';

export default defineComponent({
  name: 'ProductView',
  components: {
    Header,
    ProductList,
  },
  setup() {
    const searchTerm = ref('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const products = ref<Product[]>([]);
    const totalCount = ref(0);

    const fetchProducts = async () => {
      const term = debouncedSearchTerm.value
      const query = term
        ? `q=${term}`
        : '';

      const { data, totalCount: count } = await fetchData('products', query);
      products.value = data;
      totalCount.value = count;
    };

    watch(debouncedSearchTerm, fetchProducts);

    fetchProducts();

    const resetFilters = () => {
      searchTerm.value = '';
    };

    return {
      searchTerm,
      debouncedSearchTerm,
      products,
      resetFilters,
    };
  },
});
</script>
