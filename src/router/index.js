import { createRouter, createWebHistory } from "vue-router";
import HomeScreen from "../screens/visitante/HomeScreen.vue";
import LoginScreen from "../screens/visitante/LoginScreen.vue";
import RegisterScreen from "../screens/visitante/RegisterScreen.vue";
import UsuarioScreen from "../screens/usuarios/UsuarioScreen.vue";
import LoginEnlace from "../screens/visitante/LoginEnlace";
import MagicLogin from "../screens/visitante/MagicLogin.vue";
import SeguridadPage from "../components/usuarios/Perfil.vue";

const routes = [
  { path: "/", name: "Home", component: HomeScreen },
  { path: "/login", name: "Login", component: LoginScreen },
  { path: "/magic-link", name: "MagicLink", component: LoginEnlace },
  { path: "/magic-login/:token", name: "MagicLogin", component: MagicLogin },
  { path: "/register", name: "Register", component: RegisterScreen },
  { path: "/usuario", component: UsuarioScreen },
  { path: "/seguridad", name: "Seguridad", component: SeguridadPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
