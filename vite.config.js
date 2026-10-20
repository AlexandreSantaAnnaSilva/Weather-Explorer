import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' funciona no GitHub Pages (com ou sem domínio próprio)
export default defineConfig({ plugins: [react()], base: './' });
