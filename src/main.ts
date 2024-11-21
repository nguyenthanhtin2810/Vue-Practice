import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n';
import './assets/tailwind.css';
import router from './router/main';

const app = createApp(App);

app.use(router);
app.use(i18n);
app.mount('#app');
