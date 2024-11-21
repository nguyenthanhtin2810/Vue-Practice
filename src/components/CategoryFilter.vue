<template>
  <div class="text-sm">
    <h3 class="text-xs font-semibold text-start">{{ t('category') }}</h3>
    <ul class="mt-3 space-y-3 max-h-80 overflow-hidden hover:overflow-y-auto">
      <template v-if="categoriesInfo">
        <li v-for="(info, level1Category) in categoriesInfo" :key="level1Category">
          <button
            type="button"
            @click="handleLevel1Click(level1Category)"
            :class="['flex items-center cursor-pointer', { 'font-bold': modelValue.selectedLevel1 === level1Category }]"
          >
            <img
              :src="Triangle"
              :alt="$t('triangle_icon_alt')"
              :class="['transition-transform duration-200 transform mr-2', { 'rotate-180': modelValue.selectedLevel1 === level1Category }]"
            />
            {{ level1Category }}
            <span class="ml-2 text-[10px] text-gray-600 bg-gray-100 px-1 rounded font-bold">
              {{ info.count }}
            </span>
          </button>
          <ul v-if="modelValue.selectedLevel1 === level1Category" class="ml-3 mt-3 space-y-3">
            <li
              v-for="(count, level2Category) in info.subcategories"
              :key="level2Category"
            >
              <button
                type="button"
                @click="handleLevel2Click(level2Category, level1Category)"
                :class="['flex items-center cursor-pointer', { 'font-bold': modelValue.selectedLevel2 === level2Category }]"
              >
                <img
                  :src="Triangle"
                  :alt="$t('triangle_icon_alt')"
                  :class="['transition-transform duration-200 transform mr-2', { 'rotate-180': modelValue.selectedLevel2 === level2Category }]"
                />
                {{ level2Category }}
                <span class="ml-2 text-[10px] text-gray-600 bg-gray-100 px-1 rounded font-bold">
                  {{ count }}
                </span>
              </button>
            </li>
          </ul>
        </li>
      </template>
      <li v-else>{{ t('load_categories') }}</li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Triangle from '../assets/icon/triangle.svg';
import { getCategoriesInfo } from '../utils/productsProcessingHelpers';

export default defineComponent({
  name: 'CategoryFilter',
  props: {
    products: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const categoriesInfo = computed(() => getCategoriesInfo(props.products));

    const handleLevel1Click = (level1Category) => {
      const newSelected = props.modelValue.selectedLevel1 !== level1Category;

      emit('update:modelValue', {
        ...props.modelValue,
        selectedLevel1: newSelected ? level1Category : '',
        category: newSelected ? level1Category : '',
        selectedLevel2: '',
      });
    };

    const handleLevel2Click = (level2Category, level1Category) => {
      const newSelected = props.modelValue.selectedLevel2 !== level2Category;

      emit('update:modelValue', {
        ...props.modelValue,
        selectedLevel2: newSelected ? level2Category : '',
        category: newSelected ? level2Category : level1Category,
        selectedLevel1: newSelected ? level1Category : props.modelValue.selectedLevel1,
      });
    };

    return {
      t,
      Triangle,
      categoriesInfo,
      handleLevel1Click,
      handleLevel2Click,
    };
  },
});
</script>
  