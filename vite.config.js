import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The week 10 research page carries its pre/post-test answer key in the page code and
// an open teacher dashboard, so it is left out of the learner web unless asked for:
//   INCLUDE_RESEARCH=1 npm run build
const includeResearch = process.env.INCLUDE_RESEARCH === '1'
if (includeResearch) console.warn('INCLUDE_RESEARCH=1: research.html (with its test answer key) will be published')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...(includeResearch ? { research: resolve(__dirname, 'research.html') } : {})
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
})
