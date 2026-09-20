import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// base: '/' porque el plan es usar un dominio propio (app.tuempresa.com) vía CNAME
// en GitHub Pages, no la ruta por defecto usuario.github.io/nombre-repo/.
// Si en algún momento decides publicar sin dominio propio, cambia esto a
// '/nombre-del-repositorio/' para que los assets carguen correctamente.
export default defineConfig({
  base: '/',
  plugins: [vue()],
})
