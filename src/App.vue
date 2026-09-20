<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { cambiarIdioma } from './i18n'
import { usuarioActual, cerrarSesion } from './services/auth'

const { locale, t } = useI18n()
const router = useRouter()

function salir() {
  cerrarSesion()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="encabezado-app">
    <router-link to="/" class="logo">{{ t('app.titulo') }}</router-link>

    <div class="acciones-header">
      <div class="selector-idioma">
        <button :class="{ activo: locale === 'es' }" @click="cambiarIdioma('es')">ES</button>
        <button :class="{ activo: locale === 'en' }" @click="cambiarIdioma('en')">EN</button>
      </div>

      <div v-if="usuarioActual" class="sesion">
        <span class="nombre-usuario">{{ usuarioActual.nombre }}</span>
        <button @click="salir" class="boton-salir">{{ t('nav.cerrarSesion') }}</button>
      </div>
    </div>
  </header>

  <main>
    <router-view />
  </main>
</template>

<style>
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #fafafa;
  color: #1f2937;
}
.encabezado-app {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e2e2e2;
}
.logo {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1f2937;
  text-decoration: none;
}
.acciones-header {
  display: flex;
  align-items: center;
  gap: 20px;
}
.selector-idioma {
  display: flex;
  gap: 4px;
}
.selector-idioma button {
  border: 1px solid #ccc;
  background: white;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}
.selector-idioma button.activo {
  background: #1f2937;
  color: white;
  border-color: #1f2937;
}
.sesion {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
}
.nombre-usuario {
  color: #555;
}
.boton-salir {
  border: 1px solid #ccc;
  background: white;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}
</style>
