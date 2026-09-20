import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import ListaEmpresas from '../views/ListaEmpresas.vue'
import NuevaEmpresa from '../views/NuevaEmpresa.vue'
import DetalleEmpresa from '../views/DetalleEmpresa.vue'
import { haySesionActiva, esAdmin } from '../services/auth'

// Usamos hash history (#/ruta) porque GitHub Pages no soporta enrutamiento
// del lado del servidor: con hash, recargar la página o compartir un link
// directo a una ruta interna siempre funciona, sin configuración extra.
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/login', name: 'login', component: Login, meta: { publica: true } },
    { path: '/', name: 'empresas', component: ListaEmpresas },
    { path: '/nueva', name: 'nueva-empresa', component: NuevaEmpresa, meta: { soloAdmin: true } },
    { path: '/empresas/:id', name: 'detalle-empresa', component: DetalleEmpresa, props: true },
  ],
})

// Protege todas las rutas excepto /login: sin sesión, redirige a login.
// La ruta de "nueva empresa" además exige rol admin (un cliente no debe crear empresas).
router.beforeEach((to) => {
  if (!to.meta.publica && !haySesionActiva()) {
    return { name: 'login' }
  }
  if (to.meta.soloAdmin && !esAdmin()) {
    return { name: 'empresas' }
  }
  if (to.name === 'login' && haySesionActiva()) {
    return { name: 'empresas' }
  }
})

export default router
