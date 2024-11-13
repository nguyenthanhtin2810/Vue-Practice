<template>
  <header class="flex flex-col justify-center items-center text-white min-h-[368px] header-background p-2">
    <a href="https://algolia.com" class="text-lg font-semibold mb-10">
      <span>algolia</span>
    </a>
    <p class="text-4xl font-light mb-10 text-center">
      {{ $t('slogan') }}
    </p>
    <SearchBar 
      v-model="searchTerm"
      :placeholder="$t('header_placeholder')" 
    />
    <div class="absolute top-2 right-2">
      <LanguageSwitcher />
    </div>
  </header>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import SearchBar from './SearchBar.vue';
import LanguageSwitcher from './LanguageSwitcher.vue';

export default defineComponent({
  name: 'Header',
  components: {
    SearchBar,
    LanguageSwitcher,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const searchTerm = ref(props.modelValue);

    watch(() => props.modelValue, (newVal) => {
      searchTerm.value = newVal;
    });

    watch(searchTerm, (newTerm) => {
      emit('update:modelValue', newTerm);
    });

    return {
      searchTerm,
    };
  },
});
</script>
