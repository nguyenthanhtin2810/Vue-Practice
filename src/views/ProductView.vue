<template>
  <Header v-model="searchTerm" />
  <div class="max-w-7xl mx-auto p-4 mt-10">
    <ProductGridFilter
      v-model:sortOption="sortOption"
      v-model:productsPerPage="productsPerPage"
    />
    <ProductList
      :products="products"
      :searchTerm="debouncedSearchTerm"
      v-model="searchTerm"
      :resetFilters="resetFilters"
    />
    <Pagination :totalPages="totalPages" v-model="currentPage" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import Header from '../components/Header.vue';
import ProductList from '../components/ProductList.vue';
import Pagination from '../components/Pagination.vue';
import ProductGridFilter from '../components/ProductGridFilter.vue';
import { Product } from '../types/products.types';
import { fetchData } from '../services/api';
import useDebounce from '../utils/useDebounce';

export default defineComponent({
  name: 'ProductView',
  components: {
    Header,
    ProductList,
    Pagination,
    ProductGridFilter,
  },
  setup() {
    const searchTerm = ref('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const products = ref<Product[]>([]);
    const totalCount = ref(0);
    const currentPage = ref(1);
    const totalPages = ref(0);
    const sortOption = ref('');
    const productsPerPage = ref(12);

    const buildQueryString = (params: Record<string, any>) => {
      const queryParts: string[] = [];

      if (params.q) queryParts.push(`q=${params.q}`);
      if (params.page && params.limit) queryParts.push(`_page=${params.page}&_limit=${params.limit}`);
      
      if (params.sortOption) {
        const [sortField, sortOrder] = params.sortOption.split('-');
        queryParts.push(`_sort=${sortField}&_order=${sortOrder}`);
      }

      return queryParts.join('&');
    };

    const fetchProducts = async () => {
      const query = buildQueryString({
        q: debouncedSearchTerm.value,
        page: currentPage.value,
        limit: productsPerPage.value,
        sortOption: sortOption.value,
      });

      const { data, totalCount: count } = await fetchData('products', query);
      products.value = data;
      totalCount.value = count;
      totalPages.value = Math.ceil(totalCount.value / productsPerPage.value);
    };

    watch([currentPage, debouncedSearchTerm, sortOption, productsPerPage], () => {
      fetchProducts();
    });

    watch([debouncedSearchTerm, sortOption, productsPerPage], () => {
      currentPage.value = 1;
    });

    fetchProducts();

    const resetFilters = () => {
      searchTerm.value = '';
      sortOption.value = '';
      productsPerPage.value = 12;
      currentPage.value = 1;
    };

    return {
      searchTerm,
      debouncedSearchTerm,
      products,
      totalPages,
      currentPage,
      sortOption,
      productsPerPage,
      resetFilters,
    };
  },
});
</script>
