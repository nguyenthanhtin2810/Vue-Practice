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
      <hr className="my-8" />
      <PriceFilter v-model="priceRange" />
      <hr className="my-8 mt-20" />
      <FreeShipFilter v-model="freeShip" />
      <hr class="my-8" />
      <RatingFilter
        v-model="selectedRating"
        :products="ratingProducts"
      />
    </div>
    <div className="md:w-4/5 w-full">
      <div className="md:hidden block mt-3 mb-10">
        <ProductGridFilter
          v-model:sortOption="sortOption"
          v-model:productsPerPage="productsPerPage"
        />
      </div>
      <ProductList
        :products="products"
        :searchTerm="debouncedSearchTerm"
        v-model="searchTerm"
        :resetFilters="resetFilters"
      />
      <Pagination :totalPages="totalPages" v-model="currentPage" />
    </div>
  </div>

  <button
    type="button"
    @click="toggleFilter"
    class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-6 py-2 rounded-lg flex items-center shadow-lg space-x-2 md:hidden"
  >
    <img
      :src="filterIcon"
      :alt="$t('filter_icon_alt')"
      class="w-5 h-5 mr-1"
    />
    <span class="font-semibold">{{ $t('filter') }}</span>
  </button>

  <div v-if="isFilterOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end md:hidden">
    <div class="w-full h-5/6 bg-white p-6 rounded-t-lg shadow-lg transition-transform transform duration-300 ease-in-out overflow-y-auto mb-14">
      <FilterHeader :totalCount="totalCount" :resetFilters="resetFilters" />
      <hr class="my-8" />
      <CategoryFilter
        v-model="categoryState"
        :products="categoryProducts"
      />
      <hr className="my-8" />
      <BrandFilter
        v-model="selectedBrands"
        :products="brandProducts"
      />
      <hr className="my-8" />
      <PriceFilter v-model="priceRange"/>
      <hr className="my-8 mt-20" />
      <FreeShipFilter v-model="freeShip" />
      <hr class="my-8" />
      <RatingFilter
        v-model="selectedRating"
        :products="ratingProducts"
      />
    </div>
    
    <div class="fixed bottom-0 bg-white w-full p-4 border-t flex justify-between">
      <button
        type="button"
        @click="resetFilters"
        class="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow-lg text-sm w-1/2 font-semibold mr-3"
      >
        {{ $t('clear_filter') }}
      </button>
      <button
        type="button"
        @click="toggleFilter"
        class="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow-lg text-sm w-1/2 font-semibold"
      >
        {{ $t('see') }} {{ totalCount }} {{ $t('results') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Header from '../components/Header.vue';
import ProductList from '../components/ProductList.vue';
import Pagination from '../components/Pagination.vue';
import ProductGridFilter from '../components/ProductGridFilter.vue';
import FilterHeader from '../components/FilterHeader.vue';
import CategoryFilter from '../components/CategoryFilter.vue';
import BrandFilter from '../components/BrandFilter.vue';
import PriceFilter from '../components/PriceFilter.vue';
import FreeShipFilter from '../components/FreeShipFilter.vue';
import RatingFilter from '../components/RatingFilter.vue';
import { Product } from '../types/products.types';
import { fetchData } from '../services/api';
import useDebounce from '../utils/useDebounce';
import filterIcon from '../assets/icon/filter.svg';

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
    PriceFilter,
    FreeShipFilter,
    RatingFilter,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const searchTerm = ref(route.query.q || '');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const products = ref<Product[]>([]);
    const categoryProducts = ref<Product[]>([]);
    const brandProducts = ref<Product[]>([]);
    const ratingProducts = ref<Product[]>([]);
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
    const priceRange = ref({
      min: Number(route.query.minPrice) || 1,
      max: Number(route.query.maxPrice) || 1500,
    });
    const debouncedPriceRange = useDebounce(priceRange, 500);
    const freeShip = ref(Boolean(route.query.limit) || false);
    const selectedRating = ref((route.query.ratings as string)?.split(',').map(Number) || []);
    const isFilterOpen = ref(false);
    
    const toggleFilter = () => {
      isFilterOpen.value = !isFilterOpen.value;
    };

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
      if (params.minPrice) {
        queryParts.push(`price_gte=${params.minPrice}`);
      }
      if (params.maxPrice) {
        queryParts.push(`price_lte=${params.maxPrice}`);
      }
      if (params.freeShip) {
        queryParts.push(`free_shipping=${params.freeShip.toString()}`);
      }
      if (params.rating && params.rating.length) {
        queryParts.push(params.rating.map((value: string) => `rating=${value}`).join('&'));
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
        minPrice: priceRange.value.min || undefined,
        maxPrice: priceRange.value.max || undefined,
        freeShip: freeShip.value || undefined,
        rating: selectedRating.value.length > 0 ? selectedRating.value.join(',') : undefined,
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
        minPrice: debouncedPriceRange.value.min,
        maxPrice: debouncedPriceRange.value.max,
        freeShip: freeShip.value,
        rating: selectedRating.value,
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
        minPrice: debouncedPriceRange.value.min,
        maxPrice: debouncedPriceRange.value.max,
        freeShip: freeShip.value,
        rating: selectedRating.value,
      });

      const { data } = await fetchData('products', query);
      categoryProducts.value = data;
    };

    const fetchBrandProducts = async () => {
      const query = buildQueryString({
        q: debouncedSearchTerm.value,
        category: categoryState.value.category,
        minPrice: debouncedPriceRange.value.min,
        maxPrice: debouncedPriceRange.value.max,
        freeShip: freeShip.value,
        rating: selectedRating.value,
      });

      const { data } = await fetchData('products', query);
      brandProducts.value = data;
    };

    const fetchRatingProducts = async () => {
      const query = buildQueryString({
        q: debouncedSearchTerm.value,
        category: categoryState.value.category,
        brands: selectedBrands.value,
        minPrice: debouncedPriceRange.value.min,
        maxPrice: debouncedPriceRange.value.max,
        freeShip: freeShip.value,
      });

      const { data } = await fetchData('products', query);
      ratingProducts.value = data;
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
      priceRange.value.min = Number(route.query.minPrice) || 1;
      priceRange.value.max = Number(route.query.maxPrice) || 1500;
      freeShip.value = Boolean(route.query.freeShip) || false;
      selectedRating.value = (route.query.rating as string)?.split(',').map(Number) || [];
    });

    let lastFetchParams = {
      searchTerm: '',
      currentPage: 1,
      sortOption: '',
      productsPerPage: 12,
      selectedCategory: '',
      selectedBrands: [""] as string[],
      minPrice: 1,
      maxPrice: 1500,
      freeShip: false,
      rating: [] as number[],
    };

    watch([
        debouncedSearchTerm,
        currentPage,
        sortOption,
        productsPerPage,
        () => categoryState.value.category, 
        selectedBrands,
        () => debouncedPriceRange.value,
        freeShip,
        selectedRating,
    ], () => {
      if (
        debouncedSearchTerm.value !== lastFetchParams.searchTerm ||
        currentPage.value !== lastFetchParams.currentPage ||
        sortOption.value !== lastFetchParams.sortOption ||
        productsPerPage.value !== lastFetchParams.productsPerPage ||
        categoryState.value.category !== lastFetchParams.selectedCategory ||
        JSON.stringify(selectedBrands.value) !== JSON.stringify(lastFetchParams.selectedBrands) ||
        debouncedPriceRange.value.min !== lastFetchParams.minPrice ||
        debouncedPriceRange.value.max !== lastFetchParams.maxPrice ||
        freeShip.value !== lastFetchParams.freeShip ||
        JSON.stringify(selectedRating.value) !== JSON.stringify(lastFetchParams.rating)
      ) {
        if (currentPage.value === lastFetchParams.currentPage) {
          currentPage.value = 1;
        }

        if (
          debouncedSearchTerm.value !== lastFetchParams.searchTerm ||
          JSON.stringify(selectedBrands.value) !== JSON.stringify(lastFetchParams.selectedBrands) ||
          debouncedPriceRange.value.min !== lastFetchParams.minPrice ||
          debouncedPriceRange.value.max !== lastFetchParams.maxPrice ||
          freeShip.value !== lastFetchParams.freeShip ||
          JSON.stringify(selectedRating.value) !== JSON.stringify(lastFetchParams.rating)
        ) {
          fetchCategoryProducts();
        }

        if (
          debouncedSearchTerm.value !== lastFetchParams.searchTerm ||
          categoryState.value.category !== lastFetchParams.selectedCategory ||
          debouncedPriceRange.value.min !== lastFetchParams.minPrice ||
          debouncedPriceRange.value.max !== lastFetchParams.maxPrice ||
          freeShip.value !== lastFetchParams.freeShip ||
          JSON.stringify(selectedRating.value) !== JSON.stringify(lastFetchParams.rating)
        ) {
          fetchBrandProducts();
        }

        if (
          debouncedSearchTerm.value !== lastFetchParams.searchTerm ||
          JSON.stringify(selectedBrands.value) !== JSON.stringify(lastFetchParams.selectedBrands) ||
          categoryState.value.category !== lastFetchParams.selectedCategory ||
          debouncedPriceRange.value.min !== lastFetchParams.minPrice ||
          debouncedPriceRange.value.max !== lastFetchParams.maxPrice ||
          freeShip.value !== lastFetchParams.freeShip
        ) {
          fetchRatingProducts();
        }

        // fetchAllProducts();
        fetchProducts();

        lastFetchParams = {
          searchTerm: debouncedSearchTerm.value as string,
          currentPage: currentPage.value,
          sortOption: sortOption.value,
          productsPerPage: productsPerPage.value,
          selectedCategory: categoryState.value.category as string,
          selectedBrands: [...selectedBrands.value],
          minPrice: debouncedPriceRange.value.min,
          maxPrice: debouncedPriceRange.value.max,
          freeShip: freeShip.value,
          rating: [...selectedRating.value],
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
      priceRange.value = { min: 1, max: 1500 };
      freeShip.value = false;
      selectedRating.value = [];
    };

    watch(isFilterOpen, (newValue) => {
      if (newValue) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    });

    return {
      searchTerm,
      debouncedSearchTerm,
      products,
      categoryProducts,
      brandProducts,
      ratingProducts,
      totalPages,
      currentPage,
      sortOption,
      productsPerPage,
      resetFilters,
      totalCount,
      categoryState,
      selectedBrands,
      priceRange,
      freeShip,
      selectedRating,
      isFilterOpen,
      toggleFilter,
      filterIcon,
    };
  },
});
</script>
