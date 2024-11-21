<template>
  <div v-if="totalPages > 1" class="mt-4 mb-32 flex justify-center items-center space-x-6 text-sm">
    <button
      type="button"
      @click="currentPage = Math.max(currentPage - 1, 1)"
      :disabled="currentPage === 1"
    >
      <img :src="AngleLeft" :alt="t('angle_left_icon_alt')" />
    </button>

    <div class="space-x-2">
      <button
        v-for="page in displayedPages"
        :key="page"
        type="button"
        @click="currentPage = page"
        :class="{
          'px-4 py-2 border rounded bg-yellow-600 text-white': page === currentPage,
          'px-4 py-2 border rounded bg-gray-200': page !== currentPage
        }"
      >
        {{ page }}
      </button>
    </div>

    <button
      type="button"
      @click="currentPage = Math.min(currentPage + 1, totalPages)"
      :disabled="currentPage === totalPages"
    >
      <img :src="AngleRight" :alt="t('angle_right_icon_alt')" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AngleLeft from '../assets/icon/angle-left.svg';
import AngleRight from '../assets/icon/angle-right.svg';

export default defineComponent({
  name: 'Pagination',
  props: {
    totalPages: {
      type: Number,
      required: true,
    },
    modelValue: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const currentPage = ref(props.modelValue);

    const displayedPages = computed(() => {
      const maxVisiblePages = 5;
      const pages: number[] = [];
  
      let startPage = Math.max(currentPage.value - Math.floor(maxVisiblePages / 2), 1);
      const endPage = Math.min(startPage + maxVisiblePages - 1, props.totalPages);
  
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
      }
  
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
  
      return pages;
    });

    watch(() => props.modelValue, (newPage) => {
      currentPage.value = newPage;
    });
    
    watch(currentPage, (newPage) => {
      emit('update:modelValue', newPage);
    });

    return {
      t,
      currentPage,
      displayedPages,
      AngleLeft,
      AngleRight,
    };
  },
});
</script>
  