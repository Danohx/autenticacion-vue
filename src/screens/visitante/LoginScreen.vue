<template>
  <div class="login-screen">
    <Navbar />
    <LoginForm />
  </div>
</template>

<script>
import Navbar from '../../components/visitante/AppNavbar.vue';
import LoginForm from '../../components/visitante/LoginForm.vue';

export default {
  name: 'LoginScreen',
  components: { Navbar, LoginForm },
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
