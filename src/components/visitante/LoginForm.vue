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
            <input :type="mostrarContraseña ? 'text' : 'password'" v-model="contraseña" placeholder="Contraseña"
              required />
            <span class="ojito" @click="mostrarContraseña = !mostrarContraseña">
              {{ mostrarContraseña ? '🙈' : '👁️' }}
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
// (Asumimos que la URL base de tu API está en una variable, es una buena práctica)
const API = "http://localhost:4000"; 

export default {
  name: "LoginPage",
  data() {
    return {
      correo: "",
      contraseña: "",
      mostrarContraseña: false,
      error: "",
      exito: "",

      // --- NUEVOS DATOS PARA 2FA ---
      // Indica si estamos esperando el código 2FA
      tfaRequerido: false, 
      // El token temporal que nos da el backend
      tempToken: "",
      // El código OTP que escribe el usuario
      codigoOTP: "", 
    };
  },
  methods: {
    validarCampos() {
      // ... (tu validación de correo sigue igual)
      const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!correoRegex.test(this.correo)) return "Correo inválido";
      return null;
    },

    // --- MÉTODO 1: LOGIN (Email/Password) ---
    async login() {
      this.error = "";
      this.exito = "";

      const validacion = this.validarCampos();
      if (validacion) {
        this.error = validacion;
        return;
      }

      try {
        // (Asegúrate de que tu backend en /auth/login implemente esta lógica 2FA)
        const respuesta = await axios.post(`${API}/auth/login`, {
          correo: this.correo, // (Cambié 'correo' a 'email' para coincidir con el backend de 2FA)
          contraseña: this.contraseña, // (Cambié 'contraseña' a 'password')
        });

        // --- LÓGICA 2FA ---
        if (respuesta.data.tfa_required) {
          // PASO 1.5: El backend pide 2FA
          this.tfaRequerido = true;
          this.tempToken = respuesta.data.temp_token;
          this.exito = "Inicia sesión con tu código de autenticación.";
          
          // Limpiamos la contraseña por seguridad
          this.contraseña = ""; 
        
        } else {
          // PASO FINAL: Login directo (2FA no estaba activo)
          this.guardarTokensYRedirigir(respuesta.data);
        }

      } catch (err) {
        this.error = err.response?.data?.mensaje || "Error al iniciar sesión, intenta de nuevo.";
      }
    },

    // --- MÉTODO 2: VERIFICAR 2FA (OTP) ---
    async verificarOTP() {
        if (!this.codigoOTP || this.codigoOTP.length < 6) {
            this.error = "Ingresa un código OTP válido de 6 dígitos.";
            return;
        }
        this.error = "";

        try {
            const respuesta = await axios.post(`${API}/auth/verify-otp`, {
                temp_token: this.tempToken,
                token: this.codigoOTP // 'token' es el nombre del campo en tu backend
            });

            // PASO FINAL: Ahora sí, login exitoso
            this.guardarTokensYRedirigir(respuesta.data);

        } catch (err) {
            this.error = err.response?.data?.mensaje || "Error al verificar el código.";
        }
    },

    // --- (Helper) Función reutilizable para guardar sesión ---
    guardarTokensYRedirigir(data) {
        // (Tu backend de 2FA devuelve 'accessToken' y 'refreshToken')
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("sessionId", data.sessionId);
        // (Tu backend de 2FA no devuelve 'nombre', tendrías que añadirlo o quitarlo aquí)
        // localStorage.setItem("nombreUsuario", data.nombre); 

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
