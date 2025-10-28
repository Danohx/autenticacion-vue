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
.screen {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-gray-100) 100%);
}

.screen__main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-lg);
}

.screen__content {
  width: 100%;
  max-width: 400px;
}

/* Responsive */
@media (max-width: 768px) {
  .screen__main {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .screen__main {
    padding: var(--spacing-md) var(--spacing-sm);
  }
}
</style>