<template>
  <div class="page-container">
    <Navbar />
    <main class="page-content">
      <LoginForm />
    </main>
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