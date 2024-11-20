<template>
  <div class="space-y-3">
    <h3 class="text-xs font-semibold text-center">{{ $t('rating') }}</h3>
    <div class="flex flex-col space-y-2">
      <button
        v-for="r in ratings"
        :key="r"
        type="button"
        :class="['flex space-x-2 cursor-pointer', isSelected(r) ? 'opacity-100' : 'opacity-50']"
        @click="handleRatingClick(r)"
      >
        <img
          v-for="index in 5"
          :key="index"
          :src="index <= r ? starFull : starEmpty"
          :alt="index <= r ? $t('star_full_icon_alt') : $t('star_empty_icon_alt')"
          class="w-5 h-5 transition-opacity duration-300"
        />
        <span class="ml-2 text-[10px] text-gray-600 bg-gray-100 px-1 rounded font-bold">
          {{ ratingCount[r] }}
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import starFull from '../assets/icon/star-full.svg';
import starEmpty from '../assets/icon/star-empty.svg';
import { getRatingCount } from '../utils/productsProcessingHelpers';

export default {
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    products: {
      type: Array,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const ratings = [5, 4, 3, 2, 1, 0];

    const ratingCount = computed(() => {
      return getRatingCount(props.products);
    });

    const handleRatingClick = (rate) => {
      const updatedRates = props.modelValue.includes(rate)
        ? props.modelValue.filter(item => item !== rate)
        : [...props.modelValue, rate]

      emit('update:modelValue', updatedRates);
    };

    const isSelected = (rate) => props.modelValue.includes(rate);

    return {
      t,
      ratingCount,
      ratings,
      starFull,
      starEmpty,
      handleRatingClick,
      isSelected
    };
  }
};
</script>
