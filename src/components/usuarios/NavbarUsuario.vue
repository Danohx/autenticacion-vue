<template>
  <nav class="navbar">
    <div class="nav-left">
      <div class="logo" @click="$router.push('/usuario')">Home</div>
    </div>
    <div class="nav-right">
      <button @click="cerrarSesion">Cerrar sesión</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavbarUsuario",
  methods: {
    cerrarSesion() {
      localStorage.removeItem("token");
      localStorage.removeItem("nombreUsuario"); // Guardaremos el nombre del usuario al loguear
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
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
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #e74c3c;
  color: white;
  transition: 0.2s all;
}

.nav-right button:hover {
  background-color: #c0392b;
}
</style>
