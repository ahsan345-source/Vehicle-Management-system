import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config - dev server runs on port 5173 by default.
// VITE_API_URL (in a .env file) controls which backend the app talks to.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
