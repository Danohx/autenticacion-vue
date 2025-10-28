<template>
  <div class="screen">
    <main class="screen__main">
      <div class="magic-verify">
        <div class="magic-verify__content">
          <h1 v-if="!error" class="magic-verify__title">Verificando tu enlace...</h1>
          
          <div v-if="error" class="alert alert--error">
            <p class="alert__message">{{ error }}</p>
          </div>
          
          <div v-if="exito" class="alert alert--success">
            <p class="alert__message">{{ exito }}</p>
          </div>

          <button 
            v-if="error" 
            type="button" 
            class="btn btn--secondary btn--full"
            @click="$router.push('/login')"
          >
            Volver al login
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";
const API_URL = "http://localhost:4000";

export default {
  name: "MagicLinkVerify",
  data() {
    return {
      error: "",
      exito: "",
    };
  },
  async mounted() {
    try {
      const token = this.$route.params.token;

      if (!token) {
        this.error = "Token no proporcionado en el enlace.";
        return;
      }

      const respuesta = await axios.post(`${API_URL}/auth/magic-login/verify`, {
        token: token,
      });

      this.exito = "¡Autenticación exitosa! Redirigiendo...";

      localStorage.setItem("token", respuesta.data.token);
      
      setTimeout(() => {
        this.$router.push('/usuario');
      }, 1500);

    } catch (err) {
      this.error = err.response?.data?.mensaje || "Enlace inválido o expirado.";
    }
  },
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

.magic-verify {
  width: 100%;
  max-width: 400px;
}

.magic-verify__content {
  text-align: center;
  background: var(--color-white);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
}

.magic-verify__title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-gray-800);
  margin-bottom: var(--spacing-lg);
}

/* Responsive */
@media (max-width: 768px) {
  .screen__main {
    padding: var(--spacing-lg) var(--spacing-md);
  }
  
  .magic-verify__content {
    padding: var(--spacing-xl);
  }
}

@media (max-width: 480px) {
  .screen__main {
    padding: var(--spacing-md) var(--spacing-sm);
  }
  
  .magic-verify__content {
    padding: var(--spacing-lg);
  }
  
  .magic-verify__title {
    font-size: var(--font-size-xl);
  }
}
</style>