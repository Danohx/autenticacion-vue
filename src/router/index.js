import { createRouter, createWebHistory } from 'vue-router';
import HomeScreen from '../screens/visitante/HomeScreen.vue';
import LoginScreen from '../screens/visitante/LoginScreen.vue';
import RegisterScreen from '../screens/visitante/RegisterScreen.vue';
import UsuarioScreen from '../screens/usuarios/UsuarioScreen.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeScreen },
  { path: '/login', name: 'Login', component: LoginScreen },
  { path: '/register', name: 'Register', component: RegisterScreen },
  { path: '/usuario', component: UsuarioScreen }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
