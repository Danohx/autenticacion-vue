import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import RegisterPage from '../components/RegisterPage.vue';
import LoginPage from '../components/LoginPage.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/login', name: 'Login', component: LoginPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
