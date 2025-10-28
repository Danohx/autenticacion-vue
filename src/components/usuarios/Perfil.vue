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

            <div v-if="!setupIniciado && !tfaCompletado" class="feature">
              <p class="feature__description">
                Añade una capa extra de seguridad a tu cuenta. Requerirás un código de una app de autenticación (como Google Authenticator o Authy) cada vez que inicies sesión.
              </p>
              <button @click="iniciarSetup2FA" class="btn btn--primary">
                Activar 2FA
              </button>
            </div>

            <div v-if="setupIniciado && !tfaCompletado" class="setup">
              <div class="setup__step">
                <h3 class="setup__step-title">Paso 1: Escanea el Código QR</h3>
                <p class="setup__step-description">
                  Usa tu app de autenticación para escanear este código. Si no puedes escanearlo, puedes ingresar el secreto manualmente.
                </p>
                
                <div class="setup__qr">
                  <qrcode-vue 
                    v-if="otpUrl" 
                    :value="otpUrl" 
                    :size="200" 
                    level="H" 
                    class="setup__qr-code"
                  />
                  <div v-else class="setup__qr-loading">
                    Generando código QR...
                  </div>
                </div>
                
                <p class="setup__secret">
                  Secreto: <code class="secret-code">{{ secretoManual }}</code>
                </p>
              </div>

              <div class="setup__divider"></div>

              <div class="setup__step">
                <h3 class="setup__step-title">Paso 2: Verifica tu código</h3>
                <p class="setup__step-description">
                  Ingresa el código de 6 dígitos que aparece en tu app para completar la activación.
                </p>
                
                <form @submit.prevent="habilitar2FA" class="form">
                  <div class="form__group">
                    <input 
                      type="text" 
                      v-model="codigoOTP" 
                      placeholder="Código de 6 dígitos" 
                      required 
                      maxlength="6"
                      pattern="\d{6}"
                      class="form__input"
                    />
                  </div>
                  <button type="submit" class="btn btn--primary btn--full">
                    Verificar y Activar
                  </button>
                </form>
              </div>
            </div>
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

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

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
        this.error = "No estás autenticado. Por favor, inicia sesión de nuevo.";
        return;
      }

      try {
        const respuesta = await axios.post(
          `${API}/auth/2fa/setup`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.otpUrl = respuesta.data.otpauth_url;
        this.setupIniciado = true;
      } catch (err) {
        this.error = err.response?.data?.mensaje || "Error al iniciar la configuración 2FA.";
      }
    },

    async habilitar2FA() {
      this.error = "";
      this.exitoInicial = "";
      const token = localStorage.getItem("token");

      if (!token || !this.codigoOTP) {
        this.error = "Falta el token o el código OTP.";
        return;
      }

      try {
        const respuesta = await axios.post(
          `${API}/auth/2fa/enable`,
          {
            token: this.codigoOTP,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (respuesta.data.success) {
          this.exitoInicial = "¡2FA activado con éxito!";
          this.tfaCompletado = true;
          this.setupIniciado = false;
          this.otpUrl = "";
          this.codigoOTP = "";
          this.error = "";

          setTimeout(() => {
            this.$router.push('/usuario'); 
          }, 2000);
        } else {
          this.error = "Respuesta inesperada del servidor.";
        }
      } catch (err) {
        this.error = err.response?.data?.message || "Error al habilitar 2FA. El código podría ser incorrecto.";
      }
    },
  },
};
</script>

<style scoped>
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

/* Responsive */
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
