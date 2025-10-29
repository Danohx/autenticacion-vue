<template>
  <div class="home">
    <div class="contenido">

      <div v-if="tfaRequerido" class="formulario-2fa">
        <h1>Verificación 2FA</h1>
        <h2>Ingresa el código de tu app de autenticación</h2>

        <form @submit.prevent="verificarOTP" class="formulario">
          <input
            type="text"
            v-model="codigoOTP"
            placeholder="Código de 6 dígitos"
            required
            maxlength="6"
            pattern="\d{6}"
          />
          <button type="submit">Verificar Código</button>
        </form>

        <p class="mensaje">
          <span @click="tfaRequerido = false; error = ''; exito = ''">
            Volver al login
          </span>
        </p>

      </div>

      <div v-else class="formulario-login">
        <h1>Login</h1>
        <h2>Inicia sesión en tu cuenta</h2>

        <form @submit.prevent="login" class="formulario">
          <input type="email" v-model="correo" placeholder="Correo" required />

          <div class="password-field">
            <input :type="mostrarContrasena ? 'text' : 'password'" v-model="contrasena" placeholder="Contraseña"
              required />
            <span class="ojito" @click="mostrarContrasena = !mostrarContrasena">
              {{ mostrarContrasena ? '🙈' : '👁️' }}
            </span>
          </div>

          <button type="submit">Iniciar sesión</button>
        </form>

        <p class="mensaje">
          ¿Prefieres no usar contraseña?
          <span @click="$router.push('/magic-link')">
            Accede con un enlace mágico ✨
          </span>
        </p>

        <p class="mensaje">
          ¿No tienes cuenta?
          <span @click="$router.push('/register')">Regístrate</span>
        </p>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="exito" class="exito">{{ exito }}</p>

    </div>
  </div>
</template>

<script>
import axios from "axios";
const API = process.env.VUE_APP_API_URL || "http://localhost:4000";

export default {
  name: "LoginPage",
  data() {
    return {
      correo: "",
      // --- CAMBIO AQUÍ: Nombre de la variable ---
      contrasena: "",
      // --- CAMBIO AQUÍ: Nombre de la variable ---
      mostrarContrasena: false,
      error: "",
      exito: "",

      // Datos 2FA (sin cambios)
      tfaRequerido: false,
      tempToken: "",
      codigoOTP: "",
    };
  },
  methods: {
    validarCampos() {
      const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!correoRegex.test(this.correo)) return "Correo inválido";
      return null;
    },

    async login() {
      this.error = "";
      this.exito = "";

      const validacion = this.validarCampos();
      if (validacion) {
        this.error = validacion;
        return;
      }

      try {
        const respuesta = await axios.post(`${API}/auth/login`, {
          correo: this.correo,
          // --- CAMBIO AQUÍ: Clave enviada al backend ---
          contrasena: this.contrasena,
        });

        if (respuesta.data.tfa_required) {
          this.tfaRequerido = true;
          this.tempToken = respuesta.data.temp_token;
          this.exito = "Inicia sesión con tu código de autenticación.";
          // --- CAMBIO AQUÍ: Limpiamos la variable correcta ---
          this.contrasena = "";

        } else {
          this.guardarTokensYRedirigir(respuesta.data);
        }

      } catch (err) {
        this.error = err.response?.data?.mensaje || "Error al iniciar sesión, intenta de nuevo.";
      }
    },

    async verificarOTP() {
        if (!this.codigoOTP || this.codigoOTP.length < 6) {
            this.error = "Ingresa un código OTP válido de 6 dígitos.";
            return;
        }
        this.error = "";

        try {
            const respuesta = await axios.post(`${API}/auth/verify-otp`, {
                temp_token: this.tempToken,
                token: this.codigoOTP
            });

            this.guardarTokensYRedirigir(respuesta.data);

        } catch (err) {
            this.error = err.response?.data?.mensaje || "Error al verificar el código.";
        }
    },

    guardarTokensYRedirigir(data) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("sessionId", data.sessionId);
        // Descomenta si tu backend devuelve 'nombre' en el login exitoso
        localStorage.setItem("nombreUsuario", data.nombre);

        this.exito = "Login exitoso! Redirigiendo...";
        setTimeout(() => this.$router.push("/usuario"), 1000);
    }
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  width: 100%;
  box-sizing: border-box;
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

.formulario button:hover {
  background-color: #2980b9;
}

.mensaje {
  margin-top: 10px;
  font-size: 14px;
  color: #34495e;
}

.mensaje span {
  color: #3498db;
  cursor: pointer;
  font-weight: 600;
}

.error {
  color: #e74c3c;
  font-weight: bold;
}

.exito {
  color: #2ecc71;
  font-weight: bold;
}

@media (max-width: 768px) {
  .contenido h1 {
    font-size: 36px;
  }

  .contenido h2 {
    font-size: 22px;
  }

  .nav-right button {
    padding: 8px 15px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .navbar {
    flex-direction: column;
    gap: 10px;
    padding: 10px 20px;
  }

  .nav-right {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .nav-right button {
    width: 100%;
  }

  .formulario {
    width: 90%;
  }
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
