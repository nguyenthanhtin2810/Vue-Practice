<template>
  <div class="flex justify-end space-x-2 mr-4 mt-4">
    <button
      type="button"
      :class="{
        'px-3 py-1 rounded-md text-sm font-medium transition-colors duration-300': true,
        'bg-gray-200 text-gray-700': currentLanguage === 'vi',
        'bg-black text-white hover:bg-gray-300 hover:text-gray-800': currentLanguage !== 'vi'
      }"
      @click="changeLanguage('vi')"
    >
      VI
    </button>
    <button
      type="button"
      :class="{
        'px-2 py-1 rounded-md text-sm font-medium transition-colors duration-300': true,
        'bg-gray-200 text-gray-700': currentLanguage === 'en',
        'bg-black text-white hover:bg-gray-300 hover:text-gray-800': currentLanguage !== 'en'
      }"
      @click="changeLanguage('en')"
    >
      EN
    </button>
  </div>
</template>

<script>
export default {
  name: 'LanguageSwitcher',
  computed: {
    currentLanguage() {
      return this.$i18n.locale;
    }
  },
  methods: {
    changeLanguage(language) {
      this.$i18n.locale = language;
    }
  }
}
</script>
