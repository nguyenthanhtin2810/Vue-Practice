<template>
  <div class="space-y-3">
    <h3 class="text-xs font-semibold text-start">{{ t('freeship') }}</h3>
    <div class="flex mt-5">
      <p class="w-2/3 mr-2 text-sm text-start">{{ t('freeship_text') }}</p>
      <div class="w-1/3 flex">
        <span class="w-1/2 mr-1 text-xs" :class="modelValue ? 'text-yellow-500' : 'text-gray-300'">
          {{ modelValue ? t('yes') : t('no') }}
        </span>
        <div class="w-1/2">
          <button
            type="button"
            :aria-label="modelValue ? 'Disable free shipping' : 'Enable free shipping'"
            class="w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer"
            :class="modelValue ? 'bg-yellow-500' : 'bg-gray-300'"
            @click="toggleFreeShip"
          >
            <div
              class="bg-white w-4 h-4 rounded-full shadow-md transform duration-200"
              :class="modelValue ? 'translate-x-5' : ''"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const toggleFreeShip = () => {
      emit('update:modelValue', !props.modelValue);
    };

    return {
      t,
      toggleFreeShip,
    };
  },
});
</script>
