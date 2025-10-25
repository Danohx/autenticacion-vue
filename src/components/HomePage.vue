<template>
  <div class="home">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-left">
        <span class="logo" @click="$router.push('/')">Home</span>
      </div>
      <div class="nav-right">
        <button @click="$router.push('/login')">Iniciar sesión</button>
        <button @click="$router.push('/register')">Registrar</button>
      </div>
    </nav>

    <!-- Contenido central -->
    <div class="contenido">
      <h1>Página principal</h1>
      <h2>Práctica Autenticación</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
};
</script>

<style scoped>
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

/* Responsivo */
@media (max-width: 768px) {
  .contenido h1 { font-size: 36px; }
  .contenido h2 { font-size: 22px; }

  .nav-right button { padding: 8px 15px; font-size: 13px; }
}

@media (max-width: 480px) {
  .navbar { flex-direction: column; gap: 10px; padding: 10px 20px; }
  .nav-right { display: flex; flex-direction: column; gap: 8px; width: 100%; }
  .nav-right button { width: 100%; }
}
</style>
