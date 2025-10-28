<template>
  <div class="page-container">
    <Navbar />
    <main class="page-content">
      <RegisterForm />
    </main>
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