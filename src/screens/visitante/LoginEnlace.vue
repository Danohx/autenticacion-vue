<template>
  <div class="login-screen">
    <Navbar />
    <LoginEnlace />
  </div>
</template>

<script>
import Navbar from '../../components/visitante/AppNavbar.vue';
import LoginEnlace from '../../components/visitante/LoginEnlace.vue';

export default {
  name: 'LoginEnlaceScreen',
  components: { Navbar, LoginEnlace },
};
</script>

<style scoped>
.login-screen {
  background: linear-gradient(to right, #f5f7fa, #c3cfe2);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
