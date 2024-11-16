<template>
  <Header v-model="searchTerm" />
  <div className="max-w-7xl mx-auto p-4 mt-10 md:flex hidden">
    <div className="w-1/5 mr-10 border-b pb-8">
      <FilterHeader
        :totalCount="totalCount"
        :resetFilters="resetFilters"
      />
    </div>
    <div className="w-4/5 border-b pb-8">
      <ProductGridFilter
        v-model:sortOption="sortOption"
        v-model:productsPerPage="productsPerPage"
      />
    </div>
  </div>
  <div class="max-w-7xl mx-auto p-4 flex">
    <div className="w-1/5 mr-10 md:block hidden">
      <CategoryFilter
        v-model="categoryState"
        :products="categoryProducts"
      />
      <hr className="my-8" />
      <BrandFilter
        v-model="selectedBrands"
        :products="brandProducts"
      />
    </div>
    <div className="md:w-4/5 w-full">
      <ProductList
        :products="products"
        :searchTerm="debouncedSearchTerm"
        v-model="searchTerm"
        :resetFilters="resetFilters"
      />
      <Pagination :totalPages="totalPages" v-model="currentPage" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Header from '../components/Header.vue';
import ProductList from '../components/ProductList.vue';
import Pagination from '../components/Pagination.vue';
import ProductGridFilter from '../components/ProductGridFilter.vue';
import FilterHeader from '../components/FilterHeader.vue';
import CategoryFilter from '../components/CategoryFilter.vue';
import BrandFilter from '../components/BrandFilter.vue';
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
    FilterHeader,
    CategoryFilter,
    BrandFilter,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    console.log(route.query);
    const searchTerm = ref(route.query.q || '');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const products = ref<Product[]>([]);
    const categoryProducts = ref<Product[]>([]);
    const brandProducts = ref<Product[]>([]);
    const totalCount = ref(0);
    const currentPage = ref(Number(route.query.page) || 1);
    const totalPages = ref(0);
    const sortOption = ref(route.query.sortOption as string || '');
    const productsPerPage = ref(Number(route.query.limit) || 12);
    const categoryState = ref({
      selectedLevel1: route.query.categorylv1 || '',
      selectedLevel2: route.query.categorylv2 || '',
      category: route.query.categorylv2 || route.query.categorylv1,
    });
    const selectedBrands = ref((route.query.brands as string)?.split(',') || []);

    const buildQueryString = (params: Record<string, any>) => {
      const queryParts: string[] = [];

      if (params.q) queryParts.push(`q=${params.q}`);
      if (params.page && params.limit) queryParts.push(`_page=${params.page}&_limit=${params.limit}`);
      
      if (params.sortOption) {
        const [sortField, sortOrder] = params.sortOption.split('-');
        queryParts.push(`_sort=${sortField}&_order=${sortOrder}`);
      }
      if (params.category) {
        queryParts.push(`categories_like=${params.category}`);
      }
      if (params.brands && params.brands.length > 0) {
        queryParts.push(params.brands.map((value: string) => `brand=${value}`).join('&'));
      }

      return queryParts.join('&');
    };

    const updateURLParams = () => {
      const query: Record<string, any> = {
        q: searchTerm.value || undefined,
        page: currentPage.value.toString() || undefined,
        limit: productsPerPage.value.toString() || undefined,
        sortOption: sortOption.value || undefined,
        categorylv1: categoryState.value.selectedLevel1 || undefined,
        categorylv2: categoryState.value.selectedLevel2 || undefined,
        brands: selectedBrands.value.length > 0 ? selectedBrands.value.join(',') : undefined,
      };

      Object.keys(query).forEach(key => query[key] === undefined && delete query[key]);

      if (JSON.stringify(query) !== JSON.stringify(route.query)) {
        router.push({ query });
      }
    };

    const fetchProducts = async () => {
      const query = buildQueryString({
        q: debouncedSearchTerm.value,
        page: currentPage.value,
        limit: productsPerPage.value,
        sortOption: sortOption.value,
        category: categoryState.value.category,
        brands: selectedBrands.value,
      });

      const { data, totalCount: count } = await fetchData('products', query);
      products.value = data;
      totalCount.value = count;
      totalPages.value = Math.ceil(totalCount.value / productsPerPage.value);
    };

    const fetchCategoryProducts = async () => {
      const query = buildQueryString({
        q: debouncedSearchTerm.value,
        brands: selectedBrands.value,
      });
      const { data } = await fetchData('products', query);
      categoryProducts.value = data;
    };

    const fetchBrandProducts = async () => {
      const query = buildQueryString({
        q: debouncedSearchTerm.value,
        category: categoryState.value.category,
      });
      const { data } = await fetchData('products', query);
      brandProducts.value = data;
    };

    watch(() => route.query, (newQuery) => {
      searchTerm.value = newQuery.q || '';
      currentPage.value = Number(newQuery.page) || 1;
      sortOption.value = newQuery.sortOption as string || '';
      productsPerPage.value = Number(route.query.limit) || 12;
      categoryState.value = {
        selectedLevel1: route.query.categorylv1 || '',
        selectedLevel2: route.query.categorylv2 || '',
        category: route.query.categorylv2 || route.query.categorylv1,
      };
      selectedBrands.value = (route.query.brands as string)?.split(',') || [];
    });

    let lastFetchParams = {
      searchTerm: '',
      currentPage: 1,
      sortOption: '',
      productsPerPage: 12,
      selectedCategory: '',
      selectedBrands: [''] as string[],
    };

    watch([
        debouncedSearchTerm,
        currentPage,
        sortOption,
        productsPerPage,
        () => categoryState.value.category, 
        selectedBrands
      ], () => {
      if (
        debouncedSearchTerm.value !== lastFetchParams.searchTerm ||
        currentPage.value !== lastFetchParams.currentPage ||
        sortOption.value !== lastFetchParams.sortOption ||
        productsPerPage.value !== lastFetchParams.productsPerPage ||
        categoryState.value.category !== lastFetchParams.selectedCategory ||
        JSON.stringify(selectedBrands.value) !== JSON.stringify(lastFetchParams.selectedBrands)
      ) {
        if (currentPage.value === lastFetchParams.currentPage) {
          currentPage.value = 1;
        }

        if (
          debouncedSearchTerm.value !== lastFetchParams.searchTerm ||
          JSON.stringify(selectedBrands.value) !== JSON.stringify(lastFetchParams.selectedBrands)
        ) {
          fetchCategoryProducts();
        }

        if (
          debouncedSearchTerm.value !== lastFetchParams.searchTerm ||
          categoryState.value.category !== lastFetchParams.selectedCategory
        ) {
          fetchBrandProducts();
        }

        fetchProducts();

        lastFetchParams = {
          searchTerm: debouncedSearchTerm.value as string,
          currentPage: currentPage.value,
          sortOption: sortOption.value,
          productsPerPage: productsPerPage.value,
          selectedCategory: categoryState.value.category as string,
          selectedBrands: [...selectedBrands.value],
        };
      }

      updateURLParams();
    });

    const resetFilters = () => {
      searchTerm.value = '';
      sortOption.value = '';
      productsPerPage.value = 12;
      currentPage.value = 1;
      categoryState.value = {
        selectedLevel1: '',
        selectedLevel2: '',
        category: '',
      };
      selectedBrands.value = [];
    };

    return {
      searchTerm,
      debouncedSearchTerm,
      products,
      categoryProducts,
      brandProducts,
      totalPages,
      currentPage,
      sortOption,
      productsPerPage,
      resetFilters,
      totalCount,
      categoryState,
      selectedBrands,
    };
  },
});
</script>
