<template>
  <div class="home">
    <div class="contenido">
      <h1>Enlace Mágico</h1>
      <h2>Ingresa tu correo para recibir un enlace de inicio de sesión</h2>

      <form @submit.prevent="enviarEnlaceMagico" class="formulario">
        <input 
          type="email" 
          v-model="correo" 
          placeholder="Correo electrónico" 
          required 
        />

        <button type="submit">Enviar enlace mágico</button>
        <button type="button" class="volver" @click="$router.push('/login')">
          Volver al login
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="exito" class="exito">{{ exito }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginEnlace",
  data() {
    return {
      correo: "",
      error: "",
      exito: "",
    };
  },
  methods: {
    validarCorreo() {
      const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!correoRegex.test(this.correo)) return "Correo inválido";
      return null;
    },

    async enviarEnlaceMagico() {
      this.error = "";
      this.exito = "";

      const validacion = this.validarCorreo();
      if (validacion) {
        this.error = validacion;
        return;
      }

      try {
        await axios.post("http://localhost:4000/auth/magic-link", {
          correo: this.correo,
        });
        this.exito = "Se ha enviado un enlace mágico a tu correo. Revisa tu bandeja de entrada.";
      } catch (err) {
        this.error = err.response?.data?.mensaje || "Error al enviar enlace mágico, intenta de nuevo.";
      }
    },
  },
};
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(to right, #f5f7fa, #c3cfe2);
  color: #2c3e50;
}

.contenido {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
}

.contenido h1 { font-size: 48px; margin: 0; }
.contenido h2 { font-size: 24px; margin: 0; color: #34495e; }

.formulario {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 320px;
  margin-top: 20px;
}

.formulario input {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}

.formulario button {
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  background-color: #9b59b6;
  transition: 0.2s all;
}

.formulario button:hover { background-color: #8e44ad; }

.volver {
  background-color: #bdc3c7;
  color: #2c3e50;
}

.volver:hover { background-color: #95a5a6; }

.error { color: #e74c3c; font-weight: bold; }
.exito { color: #2ecc71; font-weight: bold; }

@media (max-width: 480px) {
  .formulario { width: 90%; }
}
</style>
