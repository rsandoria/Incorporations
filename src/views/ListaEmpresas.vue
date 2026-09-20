<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerEmpresas } from '../services/api'
import { esAdmin } from '../services/auth'

const router = useRouter()
const empresas = ref([])
const cargando = ref(true)
const error = ref(null)

async function cargar() {
  cargando.value = true
  error.value = null
  try {
    empresas.value = await obtenerEmpresas()
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

function irADetalle(id) {
  router.push({ name: 'detalle-empresa', params: { id } })
}

onMounted(cargar)
</script>

<template>
  <div class="pagina">
    <div class="encabezado">
      <h1>{{ $t('empresas.titulo') }}</h1>
      <router-link v-if="esAdmin()" to="/nueva" class="boton-primario">{{ $t('nav.nuevaEmpresa') }}</router-link>
    </div>

    <p v-if="cargando">{{ $t('comun.cargando') }}</p>
    <p v-else-if="error" class="mensaje-error">{{ error }}</p>
    <p v-else-if="empresas.length === 0">{{ $t('empresas.sinResultados') }}</p>

    <table v-else class="tabla">
      <thead>
        <tr>
          <th>{{ $t('empresas.columnas.nombre') }}</th>
          <th>{{ $t('empresas.columnas.tipo') }}</th>
          <th>{{ $t('empresas.columnas.estado') }}</th>
          <th>{{ $t('empresas.columnas.plan') }}</th>
          <th>{{ $t('empresas.columnas.estatus') }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="empresa in empresas" :key="empresa.id" @click="irADetalle(empresa.id)" class="fila-clicable">
          <td>{{ empresa.nombre_empresa }}</td>
          <td>{{ empresa.tipo_entidad }}</td>
          <td>{{ empresa.estado_formacion }}</td>
          <td>{{ empresa.nombre_plan || '—' }}</td>
          <td>
            <span class="etiqueta" :class="`etiqueta--${empresa.estatus_general}`">
              {{ $t(`estatus.${empresa.estatus_general}`) }}
            </span>
          </td>
          <td><a href="#" @click.prevent="irADetalle(empresa.id)">{{ $t('empresas.verDetalle') }} →</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.pagina {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}
.encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.tabla {
  width: 100%;
  border-collapse: collapse;
}
.tabla th, .tabla td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid #e2e2e2;
}
.fila-clicable {
  cursor: pointer;
}
.fila-clicable:hover {
  background: #f7f7f9;
}
.etiqueta {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  background: #eee;
}
.etiqueta--activa { background: #dcf5e3; color: #1a7a3b; }
.etiqueta--en_proceso { background: #fff3cd; color: #8a6d00; }
.etiqueta--borrador { background: #e9e9e9; color: #555; }
.etiqueta--disuelta { background: #fde2e2; color: #a3231f; }
.boton-primario {
  background: #1f2937;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
}
.mensaje-error {
  color: #a3231f;
}
</style>
