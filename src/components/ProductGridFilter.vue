<template>
  <div class="flex justify-end text-xs">
    <Select
      :options="sortOptions"
      v-model="sortOption"
      class="mr-2"
    />
    <Select
      :options="productsPerPages"
      v-model="productsPerPage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Select from './Select.vue';

export default defineComponent({
  name: 'ProductGridFilter',
  components: {
    Select,
  },
  props: {
    sortOption: {
      type: String,
      required: true,
    },
    productsPerPage: {
      type: Number,
      required: true,
    },
  },
  emits: ['update:sortOption', 'update:productsPerPage'],
  setup(props, { emit }) {
    const { t } = useI18n();
    
    const sortOption = ref(props.sortOption);
    const productsPerPage = ref(props.productsPerPage);

    const sortOptions = ref([
      { label: t('sort_featured'), value: '' },
      { label: t('price_asc'), value: 'price-asc' },
      { label: t('price_desc'), value: 'price-desc' },
    ]);

    const productsPerPages = ref([
      { label: `12 ${t('per_pages')}`, value: 12 },
      { label: `24 ${t('per_pages')}`, value: 24 },
      { label: `36 ${t('per_pages')}`, value: 36 },
    ]);

    watch(() => props.sortOption, (newVal) => {
      sortOption.value = newVal;
    });

    watch(() => props.productsPerPage, (newVal) => {
      productsPerPage.value = newVal;
    });

    watch(sortOption, (newSortOption) => {
      emit('update:sortOption', newSortOption);
    });

    watch(productsPerPage, (newProductsPerPage) => {
      emit('update:productsPerPage', newProductsPerPage);
    });

    return {
      sortOptions,
      productsPerPages,
      sortOption,
      productsPerPage,
    };
  },
});
</script>
