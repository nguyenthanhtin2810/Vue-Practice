<template>
  <div id="app">
    <ProductView />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProductView from './views/ProductView.vue';

export default defineComponent({
  name: 'App',
  components: {
    ProductView,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
