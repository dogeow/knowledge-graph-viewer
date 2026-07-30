import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function vendorChunk(id) {
  if (!id.includes('/node_modules/')) return undefined
  if (
    id.includes('/cytoscape-fcose/')
    || id.includes('/cose-base/')
    || id.includes('/layout-base/')
  ) {
    return 'graph-layout'
  }
  if (id.includes('/cytoscape/')) return 'cytoscape'
  if (
    id.includes('/react/')
    || id.includes('/react-dom/')
    || id.includes('/scheduler/')
  ) {
    return 'react'
  }
  return undefined
}

export default defineConfig({
  root: '.',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: vendorChunk,
      },
    },
  },
  test: {
    include: ['tests/**/*.test.js'],
  },
})
