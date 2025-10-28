<template>
  <div class="hero">
    <div class="hero__content">
      <h1 class="hero__title">Página Principal</h1>
      <p class="hero__subtitle">Práctica Autenticación</p>
    </div>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
  max-width: 800px;
  margin: 0 auto;
}

.hero__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.hero__title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--color-gray-900);
  line-height: 1.2;
  margin: 0;
}

.hero__subtitle {
  font-size: var(--font-size-xl);
  color: var(--color-gray-600);
  line-height: 1.6;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
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
  .hero {
    padding: var(--spacing-lg) var(--spacing-sm);
  }
  
  .hero__title {
    font-size: var(--font-size-2xl);
  }
  
  .hero__subtitle {
    font-size: var(--font-size-base);
  }
}
</style>