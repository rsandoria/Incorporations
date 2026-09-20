// src/services/api.js
// Cliente central para hablar con la API en PHP (Hostinger).
// Todas las llamadas pasan por aquí para no repetir la URL base ni el token.

import { obtenerToken, cerrarSesion } from './auth'
import router from '../router'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

async function request(path, { method = 'GET', body = null, isFormData = false } = {}) {
  const headers = {}
  const token = obtenerToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const options = { method, headers, cache: 'no-store' }
  if (body) {
    options.body = isFormData ? body : JSON.stringify(body)
  }

  const respuesta = await fetch(`${BASE_URL}${path}`, options)

  // Si el token expiró o es inválido, cerramos sesión y mandamos al login
  // en vez de dejar que cada pantalla maneje ese caso por separado.
  if (respuesta.status === 401) {
    cerrarSesion()
    router.push({ name: 'login' })
    throw new Error('Tu sesión expiró. Inicia sesión de nuevo.')
  }

  const datos = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    const mensaje = datos?.error || `Error ${respuesta.status}`
    throw new Error(mensaje)
  }

  return datos
}

// --- Autenticación ---
export async function iniciarSesion(email, password) {
  const respuesta = await fetch(`${BASE_URL}/auth.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const datos = await respuesta.json().catch(() => null)
  if (!respuesta.ok) {
    throw new Error(datos?.error || 'No se pudo iniciar sesión.')
  }
  return datos // { token, usuario }
}

// --- Empresas ---
export const obtenerEmpresas = () => request('/empresas.php')
export const obtenerEmpresaDetalle = (id) => request(`/empresas.php?id=${id}`)
export const crearEmpresa = (datos) => request('/empresas.php', { method: 'POST', body: datos })
export const actualizarEmpresa = (id, datos) => request(`/empresas.php?id=${id}`, { method: 'PUT', body: datos })

// --- Planes ---
export const obtenerPlanes = (lang = 'es') => request(`/planes.php?lang=${lang}`)

// --- Etapas ---
export const obtenerEtapas = (empresaId, lang = 'es') => request(`/etapas.php?empresa_id=${empresaId}&lang=${lang}`)
export const actualizarEtapa = (empresaEtapaId, datos) =>
  request(`/etapas.php?empresa_etapa_id=${empresaEtapaId}`, { method: 'PUT', body: datos })

// --- Socios ---
export const obtenerSocios = (empresaId) => request(`/socios.php?empresa_id=${empresaId}`)
export const crearSocio = (datos) => request('/socios.php', { method: 'POST', body: datos })
export const actualizarSocio = (id, datos) => request(`/socios.php?id=${id}`, { method: 'PUT', body: datos })
export const eliminarSocio = (id) => request(`/socios.php?id=${id}`, { method: 'DELETE' })

// --- Documentos ---
export const obtenerDocumentos = (empresaId) => request(`/documentos.php?empresa_id=${empresaId}`)
export const subirDocumento = (formData) => request('/documentos.php', { method: 'POST', body: formData, isFormData: true })
export const eliminarDocumento = (id) => request(`/documentos.php?id=${id}`, { method: 'DELETE' })
