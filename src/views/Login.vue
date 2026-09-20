<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { iniciarSesion } from '../services/api'
import { guardarSesion } from '../services/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const cargando = ref(false)
const error = ref(null)

async function entrar() {
  cargando.value = true
  error.value = null
  try {
    const { token, usuario } = await iniciarSesion(email.value, password.value)
    guardarSesion(token, usuario)
    router.push({ name: 'empresas' })
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="pagina-login">
    <form @submit.prevent="entrar" class="tarjeta-login">
      <h1>{{ $t('app.titulo') }}</h1>
      <p class="subtitulo">{{ $t('login.subtitulo') }}</p>

      <label>
        {{ $t('login.email') }}
        <input v-model="email" type="email" required autofocus />
      </label>

      <label>
        {{ $t('login.password') }}
        <input v-model="password" type="password" required />
      </label>

      <p v-if="error" class="mensaje-error">{{ error }}</p>

      <button type="submit" class="boton-primario" :disabled="cargando">
        {{ cargando ? $t('login.entrando') : $t('login.entrar') }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.pagina-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f4f6;
}
.tarjeta-login {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.tarjeta-login h1 {
  margin: 0;
  text-align: center;
}
.subtitulo {
  margin: 0 0 8px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}
label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
  color: #333;
}
input {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}
.boton-primario {
  background: #1f2937;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}
.boton-primario:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.mensaje-error {
  color: #a3231f;
  font-size: 0.85rem;
  margin: 0;
}
</style>
