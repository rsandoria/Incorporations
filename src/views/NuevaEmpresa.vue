<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { crearEmpresa, obtenerPlanes } from '../services/api'

const router = useRouter()
const { locale } = useI18n()

const planes = ref([])
const guardando = ref(false)
const error = ref(null)

const form = ref({
  nombre_empresa: '',
  tipo_entidad: 'LLC',
  estado_formacion: '',
  plan_id: '',
  email_contacto: '',
  telefono_contacto: '',
  domicilio: '',
  notas: '',
})

async function cargarPlanes() {
  planes.value = await obtenerPlanes(locale.value)
}

async function guardar() {
  guardando.value = true
  error.value = null
  try {
    const respuesta = await crearEmpresa(form.value)
    router.push({ name: 'detalle-empresa', params: { id: respuesta.id } })
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}

onMounted(cargarPlanes)
</script>

<template>
  <div class="pagina">
    <h1>{{ $t('form.tituloNueva') }}</h1>

    <form @submit.prevent="guardar" class="formulario">
      <label>
        {{ $t('form.nombreEmpresa') }} *
        <input v-model="form.nombre_empresa" required type="text" />
      </label>

      <label>
        {{ $t('form.tipoEntidad') }} *
        <select v-model="form.tipo_entidad" required>
          <option value="LLC">LLC</option>
          <option value="S-Corp">S-Corp</option>
          <option value="C-Corp">C-Corp</option>
        </select>
      </label>

      <label>
        {{ $t('form.estadoFormacion') }} *
        <input v-model="form.estado_formacion" required type="text" placeholder="CA, DE, WY..." maxlength="2" />
      </label>

      <label>
        {{ $t('form.plan') }}
        <select v-model="form.plan_id">
          <option value="">{{ $t('form.seleccionaPlan') }}</option>
          <option v-for="plan in planes" :key="plan.id" :value="plan.id">
            {{ plan.nombre_plan }} — ${{ plan.precio }}
          </option>
        </select>
      </label>

      <label>
        {{ $t('form.email') }}
        <input v-model="form.email_contacto" type="email" />
      </label>

      <label>
        {{ $t('form.telefono') }}
        <input v-model="form.telefono_contacto" type="tel" />
      </label>

      <label>
        {{ $t('form.domicilio') }}
        <input v-model="form.domicilio" type="text" />
      </label>

      <label>
        {{ $t('form.notas') }}
        <textarea v-model="form.notas" rows="3"></textarea>
      </label>

      <p class="nota">{{ $t('form.camposObligatorios') }}</p>
      <p v-if="error" class="mensaje-error">{{ error }}</p>

      <div class="acciones">
        <button type="submit" class="boton-primario" :disabled="guardando">
          {{ guardando ? $t('form.guardando') : $t('form.guardar') }}
        </button>
        <router-link to="/" class="boton-secundario">{{ $t('form.cancelar') }}</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
.pagina {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}
.formulario {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
  color: #333;
}
input, select, textarea {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}
.nota {
  font-size: 0.8rem;
  color: #777;
}
.mensaje-error {
  color: #a3231f;
}
.acciones {
  display: flex;
  gap: 12px;
}
.boton-primario {
  background: #1f2937;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.boton-primario:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.boton-secundario {
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  color: #333;
  border: 1px solid #ccc;
}
</style>
