import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '',
    name: 'ProductView',
    component: () => import('../views/ProductView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
