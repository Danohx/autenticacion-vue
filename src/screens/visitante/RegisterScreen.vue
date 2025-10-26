<template>
  <div class="register-screen">
    <Navbar />
    <RegisterForm />
  </div>
</template>

<script>
import Navbar from '../../components/visitante/AppNavbar.vue';
import RegisterForm from '../../components/visitante/RegisterForm.vue';

export default {
  name: 'RegisterScreen',
  components: { Navbar, RegisterForm },
};
</script>

<style scoped>
.register-screen {
  background: linear-gradient(to right, #f5f7fa, #c3cfe2);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
