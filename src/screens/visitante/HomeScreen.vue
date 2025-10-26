<template>
  <div class="home">
    <AppNavbar />
    <HomeContent />
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
.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(to right, #f5f7fa, #c3cfe2);
  color: #2c3e50;
}
</style>
