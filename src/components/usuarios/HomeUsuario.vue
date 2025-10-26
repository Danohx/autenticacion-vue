<template>
  <div class="home">
    <NavbarUsuario />
    <div class="contenido">
        <h1>Bienvenido, {{ nombreUsuario }}!</h1>
        <h2>Página Principal</h2>
        <h2>Práctica Autenticación</h2>
    </div>
  </div>
</template>

<script>
import NavbarUsuario from "./NavbarUsuario.vue";

export default {
  name: "HomeUsuario",
  components: { NavbarUsuario },
  data() {
    return {
      nombreUsuario: localStorage.getItem("nombreUsuario") || "Usuario",
    };
  },
};
</script>

<style scoped>
.home {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(to right, #f5f7fa, #c3cfe2);
  min-height: 100vh;
}

.contenido {
  padding: 50px 20px;
  text-align: center;
}

.contenido h1 {
  font-size: 36px;
  color: #2c3e50;
}

.contenido p {
  font-size: 18px;
  margin-top: 10px;
}

.contenido ul {
  margin-top: 20px;
  list-style: none;
  padding: 0;
}

.contenido li {
  background-color: #3498db;
  color: white;
  margin: 10px auto;
  padding: 12px;
  width: 80%;
  border-radius: 8px;
}
</style>
