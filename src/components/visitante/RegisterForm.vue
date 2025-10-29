<template>
  <div class="home">

    <div class="contenido">
      <h1>Registro</h1>
      <h2>Crea tu cuenta</h2>

      <form @submit.prevent="registrar" class="formulario">
        <input type="text" v-model="nombre" placeholder="Nombre" required />
        <input type="text" v-model="apellidoPaterno" placeholder="Apellido Paterno" required />
        <input type="text" v-model="apellidoMaterno" placeholder="Apellido Materno" required />
        <input type="text" v-model="telefono" placeholder="Número de Teléfono" required />
        <input type="email" v-model="correo" placeholder="Correo" required />
        <input type="number" v-model="edad" placeholder="Edad" required min="1" />

        <div class="password-field">
          <input
            :type="mostrarContraseña ? 'text' : 'password'"
            v-model="contraseña"
            placeholder="Contraseña"
            required
          />
          <span class="ojito" @click="mostrarContraseña = !mostrarContraseña">
            {{ mostrarContraseña ? '🙈' : '👁️' }}
          </span>
        </div>

        <div class="password-field">
          <input
            :type="mostrarConfirmar ? 'text' : 'password'"
            v-model="confirmarContraseña"
            placeholder="Confirmar Contraseña"
            required
          />
          <span class="ojito" @click="mostrarConfirmar = !mostrarConfirmar">
            {{ mostrarConfirmar ? '🙈' : '👁️' }}
          </span>
        </div>

        <button type="submit">Registrar</button>
      </form>

      <p class="mensaje">
        ¿Ya tienes cuenta? 
        <span @click="$router.push('/login')">Inicia sesión</span>
      </p>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="exito" class="exito">{{ exito }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterPage",
  data() {
    return {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      telefono: "",
      correo: "",
      edad: null,
      contraseña: "",
      confirmarContraseña: "",
      mostrarContraseña: false,
      mostrarConfirmar: false,
      error: "",
      exito: "",
    };
  },
  methods: {
    validarCampos() {
      const nombreRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
      const telefonoRegex = /^\d{10}$/;
      const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const contraseñaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

      if (!nombreRegex.test(this.nombre)) return "Nombre inválido";
      if (!nombreRegex.test(this.apellidoPaterno)) return "Apellido Paterno inválido";
      if (!nombreRegex.test(this.apellidoMaterno)) return "Apellido Materno inválido";
      if (!telefonoRegex.test(this.telefono)) return "Teléfono inválido (10 dígitos)";
      if (!correoRegex.test(this.correo)) return "Correo inválido";
      if (this.edad <= 0) return "Edad inválida";
      if (!contraseñaRegex.test(this.contraseña)) 
        return "Contraseña debe tener al menos 6 caracteres, incluir números y letras";
      if (this.contraseña !== this.confirmarContraseña) return "Las contraseñas no coinciden";

      return null;
    },
    async registrar() {
      this.error = "";
      this.exito = "";

      const validacion = this.validarCampos();
      if (validacion) {
        this.error = validacion;
        return;
      }

      try {
        const API_URL = process.env.VUE_APP_API_URL || "http://localhost:4000";
        
        await axios.post(`${API_URL}/auth/register`, {
          nombre: this.nombre,
          apellido_paterno: this.apellidoPaterno,
          apellido_materno: this.apellidoMaterno,
          telefono: this.telefono,
          correo: this.correo,
          edad: this.edad,
          contraseña: this.contraseña
        });
        this.exito = "Registro exitoso! Redirigiendo al login...";
        setTimeout(() => this.$router.push("/login"), 1500);
      } catch (err) {
        this.error = err.response?.data?.mensaje || "Error al registrar, intenta de nuevo.";
      }
    },
  },
};
</script>

<style scoped>
/* reutiliza tu CSS anterior */
/* General */
.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(to right, #f5f7fa, #c3cfe2);
  color: #2c3e50;
}

/* Navbar */
.navbar {
  width: 100%;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffffcc;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left .logo {
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #2c3e50;
}

.nav-right button {
  margin-left: 15px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #3498db;
  color: white;
  transition: 0.2s all;
}

.nav-right button:hover {
  background-color: #2980b9;
}

/* Contenido central */
.contenido {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 20px;
}

.contenido h1 {
  font-size: 48px;
  font-weight: 700;
  margin: 0;
}

.contenido h2 {
  font-size: 28px;
  font-weight: 400;
  margin: 0;
  color: #34495e;
}

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
}

.formulario button {
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  background-color: #3498db;
  transition: 0.2s all;
}

.formulario button:hover { background-color: #2980b9; }

.mensaje { margin-top: 10px; font-size: 14px; color: #34495e; }
.mensaje span { color: #3498db; cursor: pointer; font-weight: 600; }

.error { color: #e74c3c; font-weight: bold; }
.exito { color: #2ecc71; font-weight: bold; }

@media (max-width: 768px) {
  .contenido h1 { font-size: 36px; }
  .contenido h2 { font-size: 22px; }
  .nav-right button { padding: 8px 15px; font-size: 13px; }
}

@media (max-width: 480px) {
  .navbar { flex-direction: column; gap: 10px; padding: 10px 20px; }
  .nav-right { display: flex; flex-direction: column; gap: 8px; width: 100%; }
  .nav-right button { width: 100%; }
  .formulario { width: 90%; }
}
.password-field {
  position: relative;
  display: flex;
  align-items: center;
}

.password-field .ojito {
  position: absolute;
  right: 12px;
  cursor: pointer;
  font-size: 18px;
  user-select: none;
}
</style>
