import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/nirvapays/",   // 👈 ADD THIS LINE
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
})
