<template>
  <div class="page">
    <NavbarUsuario />
    <main class="page__main">
      <div class="hero">
        <div class="hero__content">
          <h1 class="hero__title">Bienvenido, {{ nombreUsuario }}!</h1>
          <p class="hero__subtitle">Página Principal - Práctica Autenticación</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import NavbarUsuario from "./NavbarUsuario.vue";

export default {
  name: "HomeUsuario",
  components: { NavbarUsuario },
  data() {
    return {
      nombreUsuario: localStorage.getItem("nombreUsuario") || "Usuario",
    };
  },
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-gray-100) 100%);
}

.page__main {
  padding: var(--spacing-2xl) var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: var(--spacing-2xl) 0;
}

.hero__content {
  max-width: 600px;
  margin: 0 auto;
}

.hero__title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-md);
  line-height: 1.2;
}

.hero__subtitle {
  font-size: var(--font-size-xl);
  color: var(--color-gray-600);
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .page__main {
    padding: var(--spacing-xl) var(--spacing-md);
  }
  
  .hero__title {
    font-size: var(--font-size-3xl);
  }
  
  .hero__subtitle {
    font-size: var(--font-size-lg);
  }
}

@media (max-width: 480px) {
  .page__main {
    padding: var(--spacing-lg) var(--spacing-sm);
  }
  
  .hero__title {
    font-size: var(--font-size-2xl);
  }
}
</style>