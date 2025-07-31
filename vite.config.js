import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Deja solo esto y asegúrate que esté bien cerrado
  plugins: [react()],
});
