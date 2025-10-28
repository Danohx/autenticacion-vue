<template>
  <nav class="navbar">
    <div class="navbar__container">
      <div class="navbar__brand" @click="$router.push('/')">
        <span class="navbar__logo">Home</span>
      </div>
      
      <div class="navbar__actions">
        <button 
          @click="$router.push('/login')" 
          class="btn btn--secondary"
        >
          Iniciar sesión
        </button>
        
        <button 
          @click="$router.push('/register')" 
          class="btn btn--primary"
        >
          Registrar
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar',
};
</script>

<style scoped>
.navbar {
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-gray-200);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
}

.navbar__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.navbar__brand {
  display: flex;
  align-items: center;
}

.navbar__logo {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-gray-900);
  cursor: pointer;
  transition: color 0.2s ease;
}

.navbar__logo:hover {
  color: var(--color-accent);
}

.navbar__actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar__container {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .navbar__actions {
    gap: var(--spacing-xs);
  }
}

@media (max-width: 480px) {
  .navbar__container {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .navbar__actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>