<template>
  <div
    class="relative flex items-center"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <slot />
    <teleport to="body">
      <div
        v-if="isVisible"
        class="absolute z-50 p-2 text-sm text-white bg-gray-800 rounded shadow-lg"
        :class="tooltipPosition"
        :style="tooltipStyle"
      >
        <div v-if="position === 'top'" class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 border-t-8 border-t-gray-800 border-l-8 border-l-transparent border-r-8 border-r-transparent"></div>
        <div v-if="position === 'right'" class="absolute -left-2 top-1/2 transform -translate-y-1/2 border-r-8 border-r-gray-800 border-t-8 border-t-transparent border-b-8 border-b-transparent"></div>
        <div v-if="position === 'bottom'" class="absolute -top-2 left-1/2 transform -translate-x-1/2 border-b-8 border-b-gray-800 border-l-8 border-l-transparent border-r-8 border-r-transparent"></div>
        <div v-if="position === 'left'" class="absolute -right-2 top-1/2 transform -translate-y-1/2 border-l-8 border-l-gray-800 border-t-8 border-t-transparent border-b-8 border-b-transparent"></div>
        {{ text }}
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'Tooltip',
  props: {
    text: {
      type: String,
      required: true,
    },
    position: {
      type: String as () => 'top' | 'right' | 'bottom' | 'left',
      default: 'bottom',
    },
    width: {
      type: String,
      default: '300px',
    },
    offsetX: {
      type: Number,
      default: 0,
    },
    offsetY: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const isVisible = ref(false);
    const tooltipStyle = ref({
      top: '0px',
      left: '0px',
      transform: 'translate(0, 0)',
      width: '300px',
    });

    const showTooltip = (event: MouseEvent) => {
      isVisible.value = true;
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();

      switch (props.position) {
        case 'top':
          tooltipStyle.value = {
            top: `${rect.top + window.scrollY - 10 - props.offsetY}px`,
            left: `${rect.left + window.scrollX + rect.width / 2 + props.offsetX}px`,
            transform: 'translate(-50%, -100%)',
            width: props.width,
          };
          break;
        case 'right':
          tooltipStyle.value = {
            top: `${rect.top + window.scrollY + rect.height / 2 + props.offsetY}px`,
            left: `${rect.left + window.scrollX + rect.width + 10 + props.offsetX}px`,
            transform: 'translate(0, -50%)',
            width: props.width,
          };
          break;
        case 'bottom':
          tooltipStyle.value = {
            top: `${rect.bottom + window.scrollY + 10 + props.offsetY}px`,
            left: `${rect.left + window.scrollX + rect.width / 2 + props.offsetX}px`,
            transform: 'translate(-50%, 0)',
            width: props.width,
          };
          break;
        case 'left':
          tooltipStyle.value = {
            top: `${rect.top + window.scrollY + rect.height / 2 + props.offsetY}px`,
            left: `${rect.left + window.scrollX - 10 - props.offsetX}px`,
            transform: 'translate(-100%, -50%)',
            width: props.width,
          };
          break;
      }
    };

    const hideTooltip = () => {
      isVisible.value = false;
    };

    const tooltipPosition = computed(() => {
      switch (props.position) {
        case 'top':
          return 'top-full mb-2 left-1/2 transform -translate-x-1/2';
        case 'right':
          return 'left-full ml-2 top-1/2 transform -translate-y-1/2';
        case 'bottom':
          return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
        case 'left':
          return 'right-full mr-2 top-1/2 transform -translate-y-1/2';
        default:
          return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
      }
    });

    return {
      isVisible,
      showTooltip,
      hideTooltip,
      tooltipPosition,
      tooltipStyle,
    };
  },
});
</script>
