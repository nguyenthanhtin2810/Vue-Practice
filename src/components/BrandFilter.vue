<template>
  <div class="text-sm space-y-3">
    <h3 class="text-xs font-semibold text-start">{{ t('brand') }}</h3>
    <SearchBar
      v-model="searchTerm"
      :placeholder="t('brand_placeholder')"
      searchIconPosition="left-3 top-4"
      inputPadding="px-10 py-3"
      clearIconPosition="right-3 top-4"
    />
    <ul class="mt-3 max-h-64 overflow-hidden hover:overflow-y-auto space-y-2 p-2">
      <li v-for="brand in filteredBrands" :key="brand">
        <div class="flex items-center cursor-pointer">
          <button
            type="button"
            :class="['w-4 h-4 border-2 border-gray-400 rounded flex items-center justify-center mr-2', {
              'bg-yellow-600': modelValue.includes(brand),
            }]"
            @click="handleBrandClick(brand)"
          >
            <div v-if="modelValue.includes(brand)" class="w-1 h-1 bg-white rounded-full" />
          </button>
          <span v-html="highlightText(brand, searchTerm)"></span>
          <span class="ml-2 text-[10px] text-gray-600 bg-gray-100 px-1 rounded font-bold">
            {{ getProductCount(brand) }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SearchBar from './SearchBar.vue';
import { getBrandsInfo } from '../utils/productsProcessingHelpers';
import { highlightText } from '../utils/highlightText';

export default defineComponent({
  name: 'BrandFilter',
  components: {
    SearchBar
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Array,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const searchTerm = ref('');

    const brandsInfo = computed(() => getBrandsInfo(props.products));

    const filteredBrands = computed(() => {
      return Array.from(new Set([...Object.keys(brandsInfo.value), ...props.modelValue]))
        .filter((brand) => brand.toLowerCase().includes(searchTerm.value.toLowerCase()));
    });

    const handleBrandClick = (clickedBrand) => {
      const updatedBrands = props.modelValue.includes(clickedBrand)
        ? props.modelValue.filter((b) => b !== clickedBrand)
        : [...props.modelValue, clickedBrand];

      emit('update:modelValue', updatedBrands);
    };

    const getProductCount = (brand) => {
      return brandsInfo.value[brand] || 0;
    };

    return {
      t,
      searchTerm,
      filteredBrands,
      handleBrandClick,
      getProductCount,
      highlightText,
    };
  },
});
</script>
  