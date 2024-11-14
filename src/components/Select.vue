<template>
    <select
      :value="modelValue"
      @change="onSelectChange"
      class="p-1 focus:outline focus:outline-2"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'Select',
    props: {
      options: {
        type: Array as () => Array<{ label: string; value: string | number }>,
        required: true,
      },
      modelValue: {
        type: [String, Number],
        required: true,
      },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const onSelectChange = (event: Event) => {
        const value = (event.target as HTMLSelectElement).value;
        emit('update:modelValue', value);
      };
  
      return {
        onSelectChange,
      };
    },
  });
  </script>
  