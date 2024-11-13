<template>
  <div class="relative w-full max-w-2xl">
    <img
      :src="searchIcon"
      :alt="t('searchIconAlt')"
      class="h-4 w-4 absolute text-yellow-600 left-8 top-6"
    />
    <input
      type="text"
      class="w-full text-sm text-black rounded-md border border-gray-300 focus:outline-none px-14 py-5"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInputChange"
    />
    <button v-if="modelValue" type="button" @click="clearSearch">
      <img
        :src="closeIcon"
        :alt="t('clearSearchIconAlt')"
        class="h-4 w-4 text-black absolute right-8 top-6"
      />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import searchIcon from '../assets/icon/search.svg';
import closeIcon from '../assets/icon/close.svg';

export default defineComponent({
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const handleInputChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', target.value);
    };

    const clearSearch = () => {
      emit('update:modelValue', '');
    };

    return {
      t,
      searchIcon,
      closeIcon,
      handleInputChange,
      clearSearch,
    };
  },
});
</script>
