<template> 
  <div class="space-y-3">
    <h3 class="text-xs font-semibold text-start">{{ t('price') }}</h3>
    <div class="flex items-center justify-center">
      <div class="relative w-[240px]">
        <input
          type="range"
          :min="sliderMin"
          :max="sliderMax"
          :value="currentMin"
          @input="onMinChange"
          :class="`thumb pointer-events-none absolute left-0 h-0 outline-none w-[240px] mt-10 ${currentMin > sliderMax - 100 ? 'z-[5]' : 'z-[3]'}`"
        />
        <input
          type="range"
          :min="sliderMin"
          :max="sliderMax"
          :value="currentMax"
          @input="onMaxChange"
          class="thumb pointer-events-none absolute right-0 h-0 outline-none w-[240px] mt-10 z-[4]"
        />
        <div class="absolute text-xs font-bold mt-3 left-[-4px]">
          <span class="text-yellow-600">$ </span>
          {{ currentMin }}
        </div>
        <div class="absolute text-xs font-bold mt-3 right-[-5px]">
          <span class="text-yellow-600">$ </span>
          {{ currentMax }}
        </div>
        <div class="absolute w-full rounded h-1 mt-10 bg-gray-300 z-[1]" />
        <div ref="range" class="absolute rounded h-1 mt-10 bg-yellow-500 z-[2]" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const sliderMin = ref(1)
    const sliderMax = ref(1500)

    const currentMin = computed({
      get() {
        return Math.max(sliderMin.value, props.modelValue.min);
      },
      set(value) {
        emit('update:modelValue', { min: value, max: currentMax.value });
      },
    });

    const currentMax = computed({
      get() {
        return Math.min(sliderMax.value, props.modelValue.max);
      },
      set(value) {
        emit('update:modelValue', { min: currentMin.value, max: value });
      },
    });

    const range = ref(null);

    const getPercent = (value) => Math.round(((value - sliderMin.value) / (sliderMax.value - sliderMin.value)) * 100);

    const updateRangeUI = () => {
      const minPercent = getPercent(currentMin.value);
      const maxPercent = getPercent(currentMax.value);

      if (range.value) {
        range.value.style.left = `${minPercent}%`;
        range.value.style.width = `${maxPercent - minPercent}%`;
      }
    };

    const onMinChange = (event) => {
      const value = Math.min(Number(event.target.value), currentMax.value - 1);
      currentMin.value = value;
      updateRangeUI();
    };

    const onMaxChange = (event) => {
      const value = Math.max(Number(event.target.value), currentMin.value + 1);
      currentMax.value = value;
      updateRangeUI();
    };

    onMounted(updateRangeUI);

    watch([currentMin, currentMax], updateRangeUI);

    return {
      t,
      sliderMin,
      sliderMax,
      currentMin,
      currentMax,
      range,
      onMinChange,
      onMaxChange,
    };
  },
};
</script>
