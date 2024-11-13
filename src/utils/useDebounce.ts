import { ref, customRef, watch, Ref } from 'vue';

const debounce = <T extends (...args: any[]) => void>(fn: T, delay = 0, immediate = false): (...args: Parameters<T>) => void => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (immediate && !timeout) fn(...args);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

function useDebounced<T>(value: Ref<T>, delay: number, immediate: boolean = false): Ref<T> {
  const state = ref<T>(value.value);

  const debouncedRef = customRef<T>((track, trigger) => ({
    get() {
      track();
      return state.value;
    },
    set: debounce(
      (newValue: T) => {
        state.value = newValue;
        trigger();
      },
      delay,
      immediate
    ),
  }));

  watch(value, (newValue) => {
    debouncedRef.value = newValue;
  });

  return debouncedRef;
}

export default useDebounced;
