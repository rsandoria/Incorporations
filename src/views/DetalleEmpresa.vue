<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { obtenerEmpresaDetalle, actualizarEtapa, crearSocio } from '../services/api'
import { esAdmin } from '../services/auth'

const props = defineProps({ id: { type: [String, Number], required: true } })
const { locale } = useI18n()

const empresa = ref(null)
const cargando = ref(true)
const error = ref(null)
const mostrarFormSocio = ref(false)
const nuevoSocio = ref({ nombre: '', rol: '', porcentaje_participacion: '', email: '', telefono: '' })
const guardandoSocio = ref(false)

async function cargar() {
  cargando.value = true
  error.value = null
  try {
    empresa.value = await obtenerEmpresaDetalle(props.id)
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

async function avanzarEtapa(etapa) {
  const siguienteEstatus = etapa.estatus === 'pendiente' ? 'en_proceso' : 'completado'
  try {
    await actualizarEtapa(etapa.empresa_etapa_id, { estatus: siguienteEstatus })
    await cargar()
  } catch (e) {
    error.value = e.message
  }
}

async function guardarSocio() {
  guardandoSocio.value = true
  try {
    await crearSocio({ ...nuevoSocio.value, empresa_id: props.id })
    nuevoSocio.value = { nombre: '', rol: '', porcentaje_participacion: '', email: '', telefono: '' }
    mostrarFormSocio.value = false
    await cargar()
  } catch (e) {
    error.value = e.message
  } finally {
    guardandoSocio.value = false
  }
}

onMounted(cargar)
</script>

<template>
  <div class="pagina">
    <router-link to="/" class="volver">← {{ $t('detalle.volver') }}</router-link>

    <p v-if="cargando">{{ $t('comun.cargando') }}</p>
    <p v-else-if="error" class="mensaje-error">{{ error }}</p>

    <template v-else-if="empresa">
      <div class="encabezado">
        <div>
          <h1>{{ empresa.nombre_empresa }}</h1>
          <p class="subtitulo">
            {{ empresa.tipo_entidad }} · {{ empresa.estado_formacion }} ·
            <span class="etiqueta" :class="`etiqueta--${empresa.estatus_general}`">
              {{ $t(`estatus.${empresa.estatus_general}`) }}
            </span>
          </p>
        </div>
      </div>

      <!-- Línea de tiempo de etapas -->
      <section class="seccion">
        <h2>{{ $t('detalle.etapasProceso') }}</h2>
        <p v-if="!empresa.etapas || empresa.etapas.length === 0">{{ $t('detalle.sinEtapas') }}</p>
        <ol v-else class="linea-tiempo">
          <li v-for="etapa in empresa.etapas" :key="etapa.empresa_etapa_id" :class="`etapa etapa--${etapa.estatus}`">
            <div class="etapa-punto"></div>
            <div class="etapa-contenido">
              <strong>{{ etapa.nombre_etapa }}</strong>
              <span class="etiqueta" :class="`etiqueta--${etapa.estatus}`">{{ $t(`estatus.${etapa.estatus}`) }}</span>
              <p v-if="etapa.fecha_completado" class="fecha">
                {{ $t('etapa.completadoEl') }} {{ etapa.fecha_completado }}
              </p>
              <button v-if="esAdmin() && etapa.estatus !== 'completado'" @click="avanzarEtapa(etapa)" class="boton-mini">
                {{ etapa.estatus === 'pendiente' ? $t('etapa.marcarEnProceso') : $t('etapa.marcarCompletado') }}
              </button>
            </div>
          </li>
        </ol>
      </section>

      <!-- Socios -->
      <section class="seccion">
        <div class="seccion-encabezado">
          <h2>{{ $t('detalle.socios') }}</h2>
          <button v-if="esAdmin()" @click="mostrarFormSocio = !mostrarFormSocio" class="boton-mini">{{ $t('detalle.agregarSocio') }}</button>
        </div>

        <form v-if="mostrarFormSocio" @submit.prevent="guardarSocio" class="formulario-inline">
          <input v-model="nuevoSocio.nombre" :placeholder="$t('socio.nombre')" required />
          <input v-model="nuevoSocio.rol" :placeholder="$t('socio.rol')" />
          <input v-model="nuevoSocio.porcentaje_participacion" :placeholder="$t('socio.participacion')" type="number" min="0" max="100" />
          <input v-model="nuevoSocio.email" :placeholder="$t('socio.email')" type="email" />
          <button type="submit" class="boton-mini" :disabled="guardandoSocio">{{ $t('comun.guardar') }}</button>
        </form>

        <p v-if="!empresa.socios || empresa.socios.length === 0">{{ $t('detalle.sinSocios') }}</p>
        <table v-else class="tabla">
          <thead>
            <tr>
              <th>{{ $t('socio.nombre') }}</th>
              <th>{{ $t('socio.rol') }}</th>
              <th>{{ $t('socio.participacion') }}</th>
              <th>{{ $t('socio.email') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="socio in empresa.socios" :key="socio.id">
              <td>{{ socio.nombre }}</td>
              <td>{{ socio.rol || '—' }}</td>
              <td>{{ socio.porcentaje_participacion ? socio.porcentaje_participacion + '%' : '—' }}</td>
              <td>{{ socio.email || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Documentos -->
      <section class="seccion">
        <h2>{{ $t('detalle.documentos') }}</h2>
        <p v-if="!empresa.documentos || empresa.documentos.length === 0">{{ $t('detalle.sinDocumentos') }}</p>
        <ul v-else>
          <li v-for="doc in empresa.documentos" :key="doc.id">
            {{ doc.tipo_documento }} — {{ $t(`estatus.${doc.estatus}`) }}
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.pagina {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}
.volver {
  color: #555;
  text-decoration: none;
  font-size: 0.9rem;
}
.encabezado {
  margin: 16px 0 24px;
}
.subtitulo {
  color: #555;
}
.seccion {
  margin-bottom: 32px;
}
.seccion-encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.linea-tiempo {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  border-left: 2px solid #e2e2e2;
}
.etapa {
  position: relative;
  padding: 0 0 20px 20px;
}
.etapa-punto {
  position: absolute;
  left: -7px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ccc;
  border: 2px solid white;
}
.etapa--completado .etapa-punto { background: #1a7a3b; }
.etapa--en_proceso .etapa-punto { background: #d19b00; }
.etapa-contenido {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}
.fecha {
  font-size: 0.8rem;
  color: #777;
  margin: 0;
}
.etiqueta {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  background: #eee;
  display: inline-block;
}
.etiqueta--activa, .etiqueta--completado { background: #dcf5e3; color: #1a7a3b; }
.etiqueta--en_proceso { background: #fff3cd; color: #8a6d00; }
.etiqueta--borrador, .etiqueta--pendiente { background: #e9e9e9; color: #555; }
.etiqueta--disuelta { background: #fde2e2; color: #a3231f; }
.boton-mini {
  background: #1f2937;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
}
.formulario-inline {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
}
.formulario-inline input {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.tabla {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}
.tabla th, .tabla td {
  text-align: left;
  padding: 8px 10px;
  border-bottom: 1px solid #e2e2e2;
}
.mensaje-error {
  color: #a3231f;
}
</style>
