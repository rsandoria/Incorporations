// src/services/auth.js
// Manejo de la sesión: guarda el token y los datos del usuario en sessionStorage
// (se borra al cerrar la pestaña/navegador — más seguro que localStorage para esto).

import { ref } from 'vue'

const CLAVE_TOKEN = 'auth_token'
const CLAVE_USUARIO = 'auth_usuario'

// Estado reactivo compartido por toda la app (para que el header y las rutas
// reaccionen de inmediato cuando alguien inicia o cierra sesión).
export const usuarioActual = ref(cargarUsuarioGuardado())

function cargarUsuarioGuardado() {
  try {
    const datos = sessionStorage.getItem(CLAVE_USUARIO)
    return datos ? JSON.parse(datos) : null
  } catch {
    return null
  }
}

export function obtenerToken() {
  return sessionStorage.getItem(CLAVE_TOKEN)
}

export function guardarSesion(token, usuario) {
  sessionStorage.setItem(CLAVE_TOKEN, token)
  sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario))
  usuarioActual.value = usuario
}

export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_TOKEN)
  sessionStorage.removeItem(CLAVE_USUARIO)
  usuarioActual.value = null
}

export function haySesionActiva() {
  return !!obtenerToken()
}

export function esAdmin() {
  return usuarioActual.value?.rol === 'admin'
}
