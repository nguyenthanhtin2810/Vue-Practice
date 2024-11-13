<template>
  <div>
    <ol v-if="products.length > 0" class="grid md:grid-cols-4 grid-cols-1 md:gap-x-4 md:gap-y-8 md:p-4">
      <li
        v-for="product in products"
        :key="product.objectID"
        class="rounded-md transition-shadow duration-300 hover:shadow-xl hover:scale-105 p-4 md:block flex text-start"
      >
        <div class="group relative z-0 md:w-full w-2/5">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-48 object-contain mb-10"
          />
          <button
            type="button"
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-700 bg-opacity-50 text-yellow-600 text-lg font-bold"
          >
            {{ $t('add_to_cart') }}
          </button>
        </div>
        <div class="md:ml-0 ml-4 md:w-full w-3/5">
          <p class="font-semibold uppercase mb-2 leading-4 opacity-70 text-xs">
            <span v-html="highlightText(product.categories[0], searchTerm)"></span>
          </p>
          <h3 class="font-bold text-sm cursor-pointer hover:text-yellow-600">
            <span v-html="highlightText(product.name, searchTerm)"></span>
          </h3>
          <Tooltip :text="product.description" width="300px">
            <p class="text-sm md:line-clamp-3 line-clamp-2">
              <span v-html="highlightText(product.description, searchTerm)"></span>
            </p>
          </Tooltip>
          <div class="text-xs mt-2 flex items-center">
            <span class="text-yellow-600">$</span>
            <strong class="ml-1 text-sm">
              <span v-html="highlightText(product.price.toString(), searchTerm)"></span>
            </strong>
            <span class="text-yellow-600 ml-2 rounded border border-yellow-600 px-1 flex items-center">
              <img
                :src="starSolid"
                :alt="$t('rating_star_alt')"
                class="w-2 h-2 mr-1"
              />
              <span v-html="highlightText(product.rating.toString(), searchTerm)"></span>
            </span>
          </div>
        </div>
      </li>
    </ol>
    <div v-else class="flex flex-col items-center justify-center p-4 text-center">
      <div class="max-w-xs space-y-4">
        <img
          :src="searchCircle"
          :alt="$t('search_circle_icon_alt')"
          class="m-auto md:block hidden"
        />
        <p class="text-lg font-semibold">{{ $t('cant_find') }}</p>
        <p class="text-md text-gray-500">{{ $t('try_filter') }}</p>
        <button
          type="button"
          @click="resetFilters"
          class="px-4 py-2 bg-gray-200 rounded transition hover:bg-yellow-400"
        >
          <div class="flex text-sm">
            <img
              :src="clearFilter"
              :alt="$t('clear_filter_icon_alt')"
              class="mr-1"
            />
            <span>{{ $t('clear_filter') }}</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Tooltip from './Tooltip.vue';
import starSolid from '../assets/icon/star-solid.svg';
import clearFilter from '../assets/icon/return.svg';
import searchCircle from '../assets/icon/search-circle.svg';
import { highlightText } from '../utils/highlightText';

export default defineComponent({
  name: 'ProductList',
  components: {
    Tooltip,
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
    searchTerm: {
      type: String,
      required: true,
    },
    resetFilters: {
      type: Function,
      required: true,
    },
  },
  setup() {
    return {
      starSolid,
      clearFilter,
      searchCircle,
      highlightText,
    };
  },
});
</script>
