<template>
  <div class="screen">
    <AppNavbar />
    <main class="screen__main">
      <HomeContent />
    </main>
  </div>
</template>

<script>
import AppNavbar from '../../components/visitante/AppNavbar.vue';
import HomeContent from '../../components/visitante/HomeContent.vue';

export default {
  name: 'HomeScreen',
  components: { AppNavbar, HomeContent },
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
}

/* Responsive */
@media (max-width: 768px) {
  .screen__main {
    padding: var(--spacing-md);
  }
}
</style>