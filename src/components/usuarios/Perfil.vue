<template>
  <div class="page">
    <NavbarUsuario />
    <main class="page__main">
      <div class="security">
        <div class="security__header">
          <h1 class="security__title">Configuración de Seguridad</h1>
          <p class="security__description">
            Gestiona la seguridad de tu cuenta y protege tus datos
          </p>
        </div>

        <div class="security__content">
          
          <section class="section">
            <h2 class="section__title">Autenticación de Dos Factores (2FA)</h2>
            
            <div v-if="tfaCompletado" class="alert alert--success">
              <p class="alert__message">
                ¡Tu 2FA ya está activado y protegiendo tu cuenta!
              </p>
            </div>

            <div v-if="!tfaCompletado">
              <div class="feature">
                <p class="feature__description">
                  Añade una capa extra de seguridad a tu cuenta. Requerirás un código de una app de autenticación (como Google Authenticator o Authy) cada vez que inicies sesión.
                </p>
                <button 
                  v-if="!setupIniciado" 
                  @click="iniciarSetup2FA" 
                  class="btn btn--primary" 
                  :disabled="is2faLoading">
                  {{ is2faLoading ? 'Cargando...' : 'Activar 2FA' }}
                </button>
              </div>

              <transition name="cortina">
                <div v-if="setupIniciado" class="cortina-contenido setup">
                  <div class="setup__step">
                    <h3 class="setup__step-title">Paso 1: Escanea el Código QR</h3>
                    <div class="setup__qr">
                      <qrcode-vue v-if="otpUrl" :value="otpUrl" :size="200" level="H" />
                      <div v-else class="setup__qr-loading">Generando código QR...</div>
                    </div>
                    <p class="setup__secret"><code class="secret-code">{{ secretoManual }}</code></p>
                  </div>
                  <div class="setup__divider"></div>
                  <div class="setup__step">
                    <h3 class="setup__step-title">Paso 2: Verifica tu código</h3>
                    <form @submit.prevent="habilitar2FA" class="form">
                      <div class="form__group">
                        <input type="text" v-model="codigoOTP" placeholder="Código de 6 dígitos" required maxlength="6" pattern="\d{6}" class="form__input" />
                      </div>
                      <button type="submit" class="btn btn--primary btn--full">Verificar y Activar</button>
                    </form>
                  </div>
                </div>
              </transition>
            </div>
          </section>

          <section class="section">
            <h2 class="section__title">Claves de Acceso (Passkeys)</h2>
            
            <div class="feature">
              <p class="feature__description">
                Inicia sesión usando tu huella digital, rostro o el PIN de tu dispositivo. Es más rápido y seguro que una contraseña.
              </p>
              <button 
                v-if="!setupPasskeyIniciado" 
                @click="setupPasskeyIniciado = true" 
                class="btn btn--primary">
                Configurar Passkeys
              </button>
            </div>
            
            <transition name="cortina">
              <div v-if="setupPasskeyIniciado" class="cortina-contenido setup">
                <div class="setup__step">
                  <h3 class="setup__step-title">Registrar un dispositivo</h3>
                  <p class="setup__step-description">
                    Haz clic en el botón de abajo para registrar este dispositivo (PC o móvil). Tu sistema operativo te pedirá autorización (huella, PIN o rostro).
                  </p>
                  <button 
                    @click="registrarPasskey" 
                    class="btn btn--primary" 
                    :disabled="isPasskeyLoading">
                    {{ isPasskeyLoading ? 'Esperando autorización...' : 'Añadir esta Passkey' }}
                  </button>
                </div>

                <div v-if="passkeyError" class="alert alert--error" style="margin-top: 20px;">
                  <p class="alert__message">{{ passkeyError }}</p>
                </div>
                <div v-if="passkeyExito" class="alert alert--success" style="margin-top: 20px;">
                  <p class="alert__message">{{ passkeyExito }}</p>
                </div>
              </div>
            </transition>
          </section>

        </div>

        <div v-if="error" class="alert alert--error">
          <p class="alert__message">{{ error }}</p>
        </div>
        <div v-if="exitoInicial" class="alert alert--success">
          <p class="alert__message">{{ exitoInicial }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import NavbarUsuario from "./NavbarUsuario.vue";
import axios from "axios";
import QrcodeVue from 'qrcode.vue';
import { startRegistration } from '@simplewebauthn/browser';

const API = process.env.VUE_APP_API_URL || "http://localhost:4000";

export default {
  name: "SeguridadPage",
  components: {
    QrcodeVue,
    NavbarUsuario
  },
  data() {
    return {
      setupIniciado: false,
      tfaCompletado: false,
      otpUrl: "",
      codigoOTP: "",
      error: "",
      exitoInicial: "",
      is2faLoading: false,
      setupPasskeyIniciado: false,
      isPasskeyLoading: false,
      passkeyError: "",
      passkeyExito: ""
    };
  },
  computed: {
    secretoManual() {
      if (!this.otpUrl) return "...";
      try {
        const urlParams = new URLSearchParams(this.otpUrl.split('?')[1]);
        return urlParams.get('secret');
      } catch {
        return "Error al leer secreto";
      }
    }
  },
  methods: {
    async iniciarSetup2FA() {
      this.error = "";
      this.exitoInicial = "";
      const token = localStorage.getItem("token");
      if (!token) {
        this.error = "No estás autenticado.";
        return;
      }
      this.is2faLoading = true;
      try {
        const respuesta = await axios.post(
          `${API}/auth/2fa/setup`, {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.otpUrl = respuesta.data.otpauth_url;
        this.setupIniciado = true;
      } catch (err) {
        this.error = err.response?.data?.mensaje || "Error al iniciar la configuración 2FA.";
      } finally {
        this.is2faLoading = false;
      }
    },

    async habilitar2FA() {
      this.error = "";
      this.exitoInicial = "";
      const token = localStorage.getItem("token");
      if (!token || !this.codigoOTP) {
        this.error = "Token o código OTP faltante.";
        return;
      }
      try {
        const respuesta = await axios.post(
          `${API}/auth/2fa/enable`,
          { token: this.codigoOTP },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (respuesta.data.success) {
          this.tfaCompletado = true;
          this.setupIniciado = false;
          this.exitoInicial = "¡2FA activado correctamente!";
        } else {
          this.error = "Respuesta inesperada del servidor.";
        }
      } catch (err) {
        this.error = err.response?.data?.message || "Error al habilitar 2FA. El código podría ser incorrecto.";
      }
    },

    async registrarPasskey() {
      this.passkeyError = "";
      this.passkeyExito = "";
      this.isPasskeyLoading = true;

      const token = localStorage.getItem("token");
      if (!token) {
        this.passkeyError = "No estás autenticado.";
        this.isPasskeyLoading = false;
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      try {
        // 1. Pedir las opciones de registro al backend
        const optionsRes = await axios.post(
          `${API}/auth/passkey/register-options`,
          {},
          config
        );

        console.log('Opciones de registro recibidas:', optionsRes.data);

        // 2. Iniciar el registro en el navegador
        let regResp;
        try {
          regResp = await startRegistration(optionsRes.data);
        } catch (err) {
          if (err.name === 'NotAllowedError') {
            this.passkeyError = "Registro de Passkey cancelado.";
          } else {
            this.passkeyError = `Error del navegador: ${err.message}`;
          }
          this.isPasskeyLoading = false;
          return;
        }

        // 3. Enviar la respuesta firmada al backend
        const verificationRes = await axios.post(
          `${API}/auth/passkey/verify-registration`,
          regResp,
          config
        );

        if (verificationRes.data.success) {
          this.passkeyExito = "¡Passkey registrada con éxito!";
          this.setupPasskeyIniciado = false;
        } else {
          this.passkeyError = "La verificación de la Passkey falló en el servidor.";
        }

      } catch (err) {
        console.error('Error completo:', err);
        this.passkeyError = err.response?.data?.mensaje || "Error al registrar la Passkey.";
      } finally {
        this.isPasskeyLoading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Tus estilos CSS se mantienen igual */
.page {
  min-height: 100vh;
  background-color: var(--color-gray-50);
}
.page__main {
  padding: var(--spacing-2xl) var(--spacing-lg);
  max-width: 800px;
  margin: 0 auto;
}
.security__header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}
.security__title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-sm);
}
.security__description {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
}
.section {
  background: var(--color-white);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-200);
  margin-bottom: var(--spacing-xl);
}
.section__title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-800);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-gray-100);
}
.feature__description {
  color: var(--color-gray-600);
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
}
.setup__step {
  margin-bottom: var(--spacing-xl);
}
.setup__step:last-child {
  margin-bottom: 0;
}
.setup__step-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-800);
  margin-bottom: var(--spacing-sm);
}
.setup__step-description {
  color: var(--color-gray-600);
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
}
.setup__qr {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-lg);
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
}
.setup__qr-loading {
  font-style: italic;
  color: var(--color-gray-500);
}
.setup__secret {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}
.secret-code {
  background: var(--color-gray-100);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  color: var(--color-gray-800);
  font-weight: 600;
  word-break: break-all;
}
.setup__divider {
  height: 1px;
  background: var(--color-gray-200);
  margin: var(--spacing-2xl) 0;
}
.form__group {
  margin-bottom: var(--spacing-lg);
}
.form__input {
  width: 100%;
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}
.form__input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-light);
}

.btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  transition: 0.2s all;
}
.btn--primary {
  background-color: #3498db;
}
.btn--primary:hover {
  background-color: #2980b9;
}
.btn--primary:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
.btn--full {
  width: 100%;
}
.alert {
  padding: 15px;
  border-radius: 6px;
  margin-top: 20px;
}
.alert--success {
  background-color: #e8f8f0;
  color: #27ae60;
  border: 1px solid #b6e9c9;
}
.alert--error {
  background-color: #fbeae9;
  color: #e74c3c;
  border: 1px solid #f6c8c4;
}

.cortina-contenido {
  overflow: hidden;
  border-top: 1px solid var(--color-gray-200);
}

.cortina-enter-active {
  animation: slide-down 0.5s ease-in-out;
}
.cortina-leave-active {
  animation: slide-down 0.5s ease-in-out reverse;
}

@keyframes slide-down {
  0% {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
  }
  100% {
    max-height: 1000px;
    opacity: 1;
    padding-top: var(--spacing-xl);
    padding-bottom: var(--spacing-xl);
    margin-top: var(--spacing-lg);
  }
}

.cortina-contenido.setup {
  padding: var(--spacing-xl);
  margin-top: var(--spacing-lg);
  border: none;
  box-shadow: none;
  background: transparent;
}

@media (max-width: 768px) {
  .page__main {
    padding: var(--spacing-xl) var(--spacing-md);
  }
  
  .section {
    padding: var(--spacing-xl);
  }
  
  .security__title {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 480px) {
  .page__main {
    padding: var(--spacing-lg) var(--spacing-sm);
  }
  
  .section {
    padding: var(--spacing-lg);
  }
  
  .setup__qr {
    padding: var(--spacing-md);
  }
}
</style>