<template>
  <div class="flex justify-between">
    <span class="md:text-xl text-3xl font-bold">{{ t('filter') }}</span>
    <button
      type="button"
      @click="resetFilters"
      class="md:block hidden"
    >
      <div class="flex text-sm">
        <img
          :src="clearFilter"
          :alt="$t('clear_filter_icon_alt')"
          class="mr-1"
        />
        <span>{{ t('clear_filter') }}</span>
      </div>
    </button>
    <span class="md:hidden flex flex-col items-center justify-center">
      {{ totalCount }} {{ t('results') }}
    </span>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import clearFilter from '../assets/icon/return.svg';

export default defineComponent({
  name: 'FilterHeader',
  props: {
    totalCount: {
      type: Number,
      required: true,
    },
    resetFilters: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();

    return {
      t,
      clearFilter,
    };
  },
});
</script>
  