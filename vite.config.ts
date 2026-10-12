import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import wasm from 'vite-plugin-wasm'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [svelte(), wasm()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        overlay: 'overlay.html'
      }
    }
  }
})
